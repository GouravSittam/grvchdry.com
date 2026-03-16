# Next Steps After Creating The EKS Cluster

This guide starts from the point where your cluster already exists for this project.

Project values used here:

- Cluster: `grvchdry-prod-cluster`
- Region: `ap-south-1`
- Namespace: `frontend-prod`
- ECR repo: `grvchdry-frontend`
- Domain: `grvchdry.dev`, `www.grvchdry.dev`

## 1. Connect `kubectl` to your cluster

```powershell
aws eks update-kubeconfig --name grvchdry-prod-cluster --region ap-south-1
kubectl get nodes
```

If nodes are visible, your cluster is ready for the next steps.

## 2. Enable OIDC for IRSA

This is required because the Helm chart creates a service account annotated with the IAM role:
`arn:aws:iam::440165694018:role/GrvchdryFrontendRole`

```powershell
eksctl utils associate-iam-oidc-provider `
  --cluster grvchdry-prod-cluster `
  --region ap-south-1 `
  --approve
```

## 3. Create or verify the frontend IAM role

The service account name in this project is:
`grvchdry-frontend-sa`

The namespace is:
`frontend-prod`

Create the trust policy from your cluster OIDC issuer and then create the role:

```powershell
$OIDC = aws eks describe-cluster `
  --name grvchdry-prod-cluster `
  --region ap-south-1 `
  --query "cluster.identity.oidc.issuer" `
  --output text

$OIDC = $OIDC -replace "https://", ""

@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::440165694018:oidc-provider/$OIDC"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC}:sub": "system:serviceaccount:frontend-prod:grvchdry-frontend-sa",
          "${OIDC}:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
"@ | Set-Content trust-policy.json

aws iam create-role `
  --role-name GrvchdryFrontendRole `
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy `
  --role-name GrvchdryFrontendRole `
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```

If the role already exists, just verify it:

```powershell
aws iam get-role --role-name GrvchdryFrontendRole
```

## 4. Install the AWS Load Balancer Controller

Your ingress uses ALB annotations, so this controller is required before Helm deployment.

Create the controller policy if needed:

```powershell
aws iam create-policy `
  --policy-name AWSLoadBalancerControllerIAMPolicy `
  --policy-document file://iam_policy.json
```

Create the service account:

```powershell
eksctl create iamserviceaccount `
  --cluster grvchdry-prod-cluster `
  --namespace kube-system `
  --name aws-load-balancer-controller `
  --role-name AmazonEKSLoadBalancerControllerRole `
  --attach-policy-arn arn:aws:iam::440165694018:policy/AWSLoadBalancerControllerIAMPolicy `
  --approve `
  --region ap-south-1
```

Install the Helm chart:

```powershell
helm repo add eks https://aws.github.io/eks-charts
helm repo update

$VPC_ID = aws eks describe-cluster `
  --name grvchdry-prod-cluster `
  --region ap-south-1 `
  --query "cluster.resourcesVpcConfig.vpcId" `
  --output text

helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller `
  -n kube-system `
  --set clusterName=grvchdry-prod-cluster `
  --set serviceAccount.create=false `
  --set serviceAccount.name=aws-load-balancer-controller `
  --set region=ap-south-1 `
  --set vpcId=$VPC_ID

kubectl get deployment -n kube-system aws-load-balancer-controller
```

## 5. Create or verify the ECR repository

```powershell
aws ecr describe-repositories `
  --repository-names grvchdry-frontend `
  --region ap-south-1
```

If it does not exist:

```powershell
aws ecr create-repository `
  --repository-name grvchdry-frontend `
  --region ap-south-1
```

## 6. Build and push the first image

```powershell
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 440165694018.dkr.ecr.ap-south-1.amazonaws.com

docker build -f Dockerfile.prod -t grvchdry-frontend:latest .
docker tag grvchdry-frontend:latest 440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend:latest
docker push 440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend:latest
```

## 7. Verify the ACM certificate

This project currently points to:

`arn:aws:acm:ap-south-1:440165694018:certificate/c9bd9f56-0ba5-4576-95a2-979b11e74fe5`

Verify it:

```powershell
aws acm describe-certificate `
  --certificate-arn arn:aws:acm:ap-south-1:440165694018:certificate/c9bd9f56-0ba5-4576-95a2-979b11e74fe5 `
  --region ap-south-1 `
  --query "Certificate.Status"
```

If the certificate changed, update:

`helm/grvchdry-frontend/values.yaml`

## 8. Deploy the app with Helm

```powershell
kubectl create namespace frontend-prod
```

If the namespace already exists, Kubernetes will tell you and you can continue.

Deploy:

```powershell
helm upgrade --install grvchdry-frontend .\helm\grvchdry-frontend `
  --namespace frontend-prod `
  --set image.repository=440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend `
  --set image.tag=latest `
  --wait
```

Verify:

```powershell
kubectl get pods -n frontend-prod
kubectl get svc -n frontend-prod
kubectl get ingress -n frontend-prod
```

## 9. Point your domain to the ALB

Get the ALB hostname:

```powershell
kubectl get ingress -n frontend-prod -o jsonpath="{.items[0].status.loadBalancer.ingress[0].hostname}"
```

Create DNS records:

- `grvchdry.dev` -> ALB hostname
- `www.grvchdry.dev` -> ALB hostname

Use `CNAME` or your DNS provider's `ALIAS`/flattened root record support for the apex domain.

## 10. Set up GitHub Actions deployment

This repo already contains:

`.github/workflows/eks-deploy.yml`

Add these GitHub repository secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Then verify your IAM user is mapped in EKS. This repo already includes:

`aws-auth-patch.yaml`

Before applying it, confirm the node instance role ARN still matches your newly created cluster. If the node role ARN is different, update that file first.

## 11. Optional monitoring step

I changed the chart so `ServiceMonitor` is disabled by default. That is safer for this project because the app does not currently expose a real `/metrics` endpoint.

You can still install Prometheus and Grafana now:

```powershell
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install prometheus prometheus-community/kube-prometheus-stack `
  --namespace monitoring `
  --create-namespace `
  -f .\helm\monitoring\prometheus-values.yaml
```

Only enable `serviceMonitor.enabled=true` after adding an actual `/metrics` route to the app.

## 12. Final health checks

```powershell
kubectl get nodes
kubectl get pods -n frontend-prod
kubectl get ingress -n frontend-prod
kubectl logs -n frontend-prod -l app.kubernetes.io/name=grvchdry-frontend --tail=50
```
