# AWS EKS Deployment & CI/CD Presentation Guide

This guide is designed to help present the End-to-End EKS Deployment workflow for the `Grvchdry.com` Next.js frontend project. It covers architecture, the deliverables we've built, and how to present them.

## 1. Project Architecture & Tooling Summary

**Application**: Next.js Server-Side Rendered (SSR) / Static export application.
**Packaging**: Multi-stage Dockerfile optimized to use Next.js `standalone` mode, drastically reducing image size and attack surface.
**Orchestration**: Kubernetes (Amazon EKS).
**Deployment Strategy**: Helm Chart (`grvchdry-frontend`) for dynamic environment templating.
**CI/CD**: GitHub Actions deploying to Amazon ECR and then configuring EKS via Helm.

---

## 2. Deliverables Created

Review these files in the project to showcase your implementation:

1. **`Dockerfile.prod`**:
   - Implements a multi-stage build (`base`, `deps`, `builder`, `runner`).
   - Uses a non-root user (`nextjs`) for enhanced container security.
   - Leverages `output: "standalone"` via `next.config.mjs` to copy only the necessary traced files.
2. **`.dockerignore`**:
   - Ensures CI contextual builds ignore unnecessary files (`node_modules`, `.next`, etc.), saving build time.
3. **`.github/workflows/eks-deploy.yml`**:
   - Uses OIDC authentication with AWS (no hardcoded secrets).
   - Builds and tags the Docker image with the Git commit SHA.
   - Pushes to AWS ECR.
   - Connects to AWS EKS and runs `helm upgrade --install` to deploy.
4. **`helm/grvchdry-frontend` (Helm Chart)**:
   - **`Deployment`**: Uses the newly pushed ECR image dynamically.
   - **`Service`**: Exposed initially as a ClusterIP inside the cluster.
   - **`Ingress`**: Pre-configured with AWS ALB annotations and ACM (Certificate Manager) TLS integration for HTTPS routing.
   - **`HorizontalPodAutoscaler (HPA)`**: Automatically scales the pods between 2 and 10 based on CPU/Memory usage (80% threshold).
   - **`ServiceAccount`**: Sets up least-privilege AWS IRSA (IAM Roles for Service Accounts) bridging AWS IAM and EKS RBAC.

---

## 3. Observability & Security Configuration

### Monitoring (Prometheus & Grafana)
We explicitly deploy the industry-standard `kube-prometheus-stack` alongside our application to gather metrics.
- **Monitoring Stack Manifests**: Look at `helm/monitoring/README-MONITORING.md` and `prometheus-values.yaml` for how Grafana and Prometheus are pre-configured, including a default dashboard provisioned.
- **ServiceMonitor**: Look inside `helm/grvchdry-frontend/templates/servicemonitor.yaml`. This ensures the Prometheus Operator automatically discovers the Next.js frontend and begins scraping the `/metrics` endpoint.
- **Node Exporter**: The stack automatically deploys Node Exporters to monitor the underlying AWS EC2 worker node health (CPU, Memory, Disk).

### Security
- **Namespace Isolation**: Deployments are scoped directly to the `frontend-prod` namespace.
- **Rootless Containers**: Dockerfile explicitly drops root privileges.
- **TLS Termination**: Offloaded efficiently to the AWS Application Load Balancer via Ingress annotations.

---

## 4. Presentation Milestones & Screen Captures Strategy

When presenting this project, hit these milestones conceptually and visually:

1. **The Codebase Transition**: Show the `Dockerfile.prod` and explain multi-stage building. Demonstrate how `next.config.mjs` was updated to `standalone`.
2. **The Infrastructure Template**: Open the Helm `values.yaml` file. Highlight the `ingress` annotations showing the ALB mapping, and the `autoscaling` block.
3. **The Pipeline**: Display `.github/workflows/eks-deploy.yml`. Highlight the seamless step from "Pushing to ECR" to "Helm Install".
4. **Execution (If demonstrating live)**:
   - Perform a `git push` to `main`.
   - Show the GitHub Actions runner succeeding.
   - Screen capture `kubectl get pods -n frontend-prod` to prove the Next.js instances are live.
   - Screen capture the Grafana dashboard showing CPU load metrics being scraped.
