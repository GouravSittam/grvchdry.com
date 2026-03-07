# Prometheus and Grafana Deployment Guide

For this presentation, we will deploy the industry-standard `kube-prometheus-stack` which bundles Prometheus, Grafana, Alertmanager, and Node Exporter together.

## 1. Add the Helm Repository
Run these commands to add the Prometheus community repository to Helm:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

## 2. Deploy the Stack
Deploy the monitoring stack into a dedicated namespace (`monitoring`):
```bash
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f prometheus-values.yaml
```

## 3. Accessing Grafana
By default, the Grafana password is `prom-operator` (user: `admin`). To access the Grafana UI locally without an Ingress, port-forward the service:
```bash
kubectl port-forward svc/prometheus-grafana 8080:80 -n monitoring
```
Then open `http://localhost:8080` in your browser.
