# Complete EKS Rebuild Guide — From Scratch

> **Your specific config used throughout this guide:**
>
> - AWS Account ID: `440165694018`
> - Region: `ap-south-1`
> - Cluster Name: `grvchdry-prod-cluster`
> - ECR Repository: `grvchdry-frontend`
> - App Namespace: `frontend-prod`
> - Domain: `grvchdry.dev` / `www.grvchdry.dev`
> - IRSA Role: `GrvchdryFrontendRole`

---

## Prerequisites — Tools to Install Locally

Make sure you have these installed and configured before starting:

```bash
# Verify all tools are available
aws --version          # AWS CLI v2
eksctl version         # eksctl (EKS provisioner)
kubectl version        # kubectl
helm version           # Helm v3
docker --version       # Docker
```

Install links if missing:

- AWS CLI v2: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
- eksctl: https://eksctl.io/installation/
- kubectl: https://kubernetes.io/docs/tasks/tools/
- Helm: https://helm.sh/docs/intro/install/

---

## STEP 1 — Configure AWS CLI

```bash
aws configure
# AWS Access Key ID: <your-key>
# AWS Secret Access Key: <your-secret>
# Default region: ap-south-1
# Default output format: json

# Verify identity
aws sts get-caller-identity
```

Expected output should show Account: `440165694018`.

---

## STEP 2 — Create the ECR Repository

```bash
aws ecr create-repository \
  --repository-name grvchdry-frontend \
  --region ap-south-1

# Verify it was created
aws ecr describe-repositories --region ap-south-1
```

---

## STEP 3 — Create the EKS Cluster

This takes ~15 minutes. Run this command and wait for it to finish:

```bash
eksctl create cluster \
  --name grvchdry-prod-cluster \
  --region ap-south-1 \
  --node-type t3.small \
  --nodes 1 \
  --nodes-min 1 \
  --nodes-max 2 \
  --spot \
  --managed
```

After creation, update your kubeconfig:

```bash
aws eks update-kubeconfig \
  --name grvchdry-prod-cluster \
  --region ap-south-1

# Verify cluster is reachable
kubectl get nodes
```

---

## STEP 4 — Enable OIDC Provider for IRSA

IAM Roles for Service Accounts (IRSA) need an OIDC provider associated with your cluster:

```bash
eksctl utils associate-iam-oidc-provider \
  --cluster grvchdry-prod-cluster \
  --region ap-south-1 \
  --approve

# Confirm the OIDC provider was created
aws iam list-open-id-connect-providers
```

---

## STEP 5 — Create the IAM Role for the App (IRSA)

### 5a. Get your cluster's OIDC issuer URL

```bash
aws eks describe-cluster \
  --name grvchdry-prod-cluster \
  --region ap-south-1 \
  --query "cluster.identity.oidc.issuer" \
  --output text
```

Copy the URL (without `https://`). It looks like:
`oidc.eks.ap-south-1.amazonaws.com/id/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 5b. Create the trust policy file

Replace `<OIDC_ID>` with the ID from the URL above (the part after `/id/`):

```bash
# Get just the OIDC ID
OIDC_ID=$(aws eks describe-cluster \
  --name grvchdry-prod-cluster \
  --region ap-south-1 \
  --query "cluster.identity.oidc.issuer" \
  --output text | sed 's|https://||')

cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::440165694018:oidc-provider/${OIDC_ID}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_ID}:sub": "system:serviceaccount:frontend-prod:grvchdry-frontend-sa",
          "${OIDC_ID}:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
EOF
```

### 5c. Create the IAM Role

```bash
aws iam create-role \
  --role-name GrvchdryFrontendRole \
  --assume-role-policy-document file:///tmp/trust-policy.json

# Attach ECR read permissions so the pod can pull images
aws iam attach-role-policy \
  --role-name GrvchdryFrontendRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

# Verify the role ARN
aws iam get-role --role-name GrvchdryFrontendRole --query "Role.Arn" --output text
```

Expected ARN: `arn:aws:iam::440165694018:role/GrvchdryFrontendRole`

---

## STEP 6 — Install the AWS Load Balancer Controller

The Ingress with ALB requires this controller. It needs its own IAM policy first.

### 6a. Download and create the IAM policy

```bash
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.2/docs/install/iam_policy.json

aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json
```

### 6b. Create the service account for the controller

```bash
eksctl create iamserviceaccount \
  --cluster grvchdry-prod-cluster \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn arn:aws:iam::440165694018:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve \
  --region ap-south-1
```

### 6c. Install the controller via Helm

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=grvchdry-prod-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=ap-south-1 \
  --set vpcId=$(aws eks describe-cluster --name grvchdry-prod-cluster --region ap-south-1 --query "cluster.resourcesVpcConfig.vpcId" --output text)

# Verify the controller pods are running
kubectl get deployment -n kube-system aws-load-balancer-controller
```

---

## STEP 7 — Verify ACM Certificate

Your TLS certificate must exist. Check it:

```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:ap-south-1:440165694018:certificate/c9bd9f56-0ba5-4576-95a2-979b11e74fe5 \
  --region ap-south-1 \
  --query "Certificate.Status"
```

- If it outputs `ISSUED` — you're good, skip to Step 8.
- If the certificate **doesn't exist** (was deleted with the cluster), you need to re-issue it:

```bash
aws acm request-certificate \
  --domain-name grvchdry.dev \
  --subject-alternative-names www.grvchdry.dev \
  --validation-method DNS \
  --region ap-south-1
```

Add the CNAME validation records to your DNS provider, wait for it to become `ISSUED`, then update `helm/grvchdry-frontend/values.yaml` with the new certificate ARN.

---

## STEP 8 — Set GitHub Actions Secrets

Your CI/CD workflow uses `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. If you deleted the IAM user/keys, recreate them:

### 8a. Create an IAM user for GitHub Actions (if not existing)

```bash
aws iam create-user --user-name github-actions-grvchdry

# Attach required policies
aws iam attach-user-policy --user-name github-actions-grvchdry \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

aws iam attach-user-policy --user-name github-actions-grvchdry \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

# Create access keys
aws iam create-access-key --user-name github-actions-grvchdry
```

Also attach a policy to let the user run Helm/kubectl against EKS:

```bash
cat > /tmp/eks-deploy-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters"
      ],
      "Resource": "arn:aws:eks:ap-south-1:440165694018:cluster/grvchdry-prod-cluster"
    }
  ]
}
EOF

aws iam put-user-policy \
  --user-name github-actions-grvchdry \
  --policy-name EKSDeployAccess \
  --policy-document file:///tmp/eks-deploy-policy.json
```

### 8b. Grant the IAM user access inside EKS

```bash
kubectl edit configmap aws-auth -n kube-system
```

Add this under `mapUsers:` (create the section if it doesn't exist):

```yaml
mapUsers: |
  - userarn: arn:aws:iam::440165694018:user/github-actions-grvchdry
    username: github-actions-grvchdry
    groups:
      - system:masters
```

### 8c. Add secrets to GitHub

Go to your GitHub repo → **Settings → Secrets and variables → Actions** and set:

| Secret Name             | Value               |
| ----------------------- | ------------------- |
| `AWS_ACCESS_KEY_ID`     | From step 8a output |
| `AWS_SECRET_ACCESS_KEY` | From step 8a output |

---

## STEP 9 — Deploy the Monitoring Stack (Prometheus + Grafana)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f helm/monitoring/prometheus-values.yaml

# Verify all monitoring pods are running (may take 2-3 minutes)
kubectl get pods -n monitoring
```

Access Grafana locally:

```bash
kubectl port-forward svc/prometheus-grafana 8080:80 -n monitoring
# Open http://localhost:8080
# Username: admin  |  Password: admin
```

---

## STEP 10 — Build & Push the Docker Image Manually (First Deploy)

Do this once to seed ECR before GitHub Actions takes over:

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin 440165694018.dkr.ecr.ap-south-1.amazonaws.com

# Build and push
docker build -f Dockerfile.prod -t grvchdry-frontend:latest .
docker tag grvchdry-frontend:latest \
  440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend:latest
docker push 440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend:latest
```

---

## STEP 11 — Deploy the Application via Helm

```bash
# Create the namespace first
kubectl create namespace frontend-prod

helm upgrade --install grvchdry-frontend ./helm/grvchdry-frontend \
  --namespace frontend-prod \
  --set image.repository=440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend \
  --set image.tag=latest \
  --wait

# Verify pods are running
kubectl get pods -n frontend-prod
kubectl get ingress -n frontend-prod
```

---

## STEP 12 — Point DNS to the ALB

Once the Ingress is created, get the ALB hostname:

```bash
kubectl get ingress -n frontend-prod -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'
```

Go to your DNS provider and create CNAME records:

| Record             | Type  | Value                       |
| ------------------ | ----- | --------------------------- |
| `grvchdry.dev`     | CNAME | `<ALB hostname from above>` |
| `www.grvchdry.dev` | CNAME | `<ALB hostname from above>` |

> If your DNS provider doesn't support CNAME on root apex, use ALIAS record or Route 53 with an A record aliased to the ALB.

---

## STEP 13 — Trigger CI/CD Pipeline

Push any change to the `main` branch to trigger the GitHub Actions workflow:

```bash
git add .
git commit -m "chore: trigger initial deployment"
git push origin main
```

Watch the deployment at: **GitHub → Actions tab**

---

## Verification Checklist

Run these to confirm everything is healthy:

```bash
# Cluster nodes
kubectl get nodes

# App pods (should show 2+ running)
kubectl get pods -n frontend-prod

# Ingress (should show ALB address)
kubectl get ingress -n frontend-prod

# HPA (autoscaler active)
kubectl get hpa -n frontend-prod

# Monitoring pods
kubectl get pods -n monitoring

# Load balancer controller
kubectl get deployment -n kube-system aws-load-balancer-controller

# Check app logs
kubectl logs -n frontend-prod -l app.kubernetes.io/name=grvchdry-frontend --tail=50
```

---

## Quick Reference — Key Resource ARNs

| Resource        | Value                                                                                  |
| --------------- | -------------------------------------------------------------------------------------- |
| ECR Repository  | `440165694018.dkr.ecr.ap-south-1.amazonaws.com/grvchdry-frontend`                      |
| IRSA Role       | `arn:aws:iam::440165694018:role/GrvchdryFrontendRole`                                  |
| ACM Certificate | `arn:aws:acm:ap-south-1:440165694018:certificate/c9bd9f56-0ba5-4576-95a2-979b11e74fe5` |
| EKS Cluster     | `arn:aws:eks:ap-south-1:440165694018:cluster/grvchdry-prod-cluster`                    |

---

## Estimated Time Per Step

| Step                          | Time        |
| ----------------------------- | ----------- |
| Steps 1–2                     | ~3 min      |
| Step 3 (EKS cluster creation) | ~15 min     |
| Steps 4–6                     | ~10 min     |
| Steps 7–8                     | ~5 min      |
| Steps 9–11                    | ~10 min     |
| Steps 12–13                   | ~5 min      |
| **Total**                     | **~48 min** |
