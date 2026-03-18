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

By default, the Grafana password is `admin123` (user: `admin`). To access the Grafana UI locally without an Ingress, port-forward the service:

```bash
kubectl port-forward --address 127.0.0.1 svc/prometheus-grafana 3000:3000 -n monitoring
```

Then open `http://127.0.0.1:3000` in your browser.

If Grafana loads but dashboard panels keep spinning, run `kubectl get pods -n monitoring` and make sure the Prometheus pod is `Running` before opening the dashboards.

If the page shows `Grafana has failed to load its application files`, stop any older `kubectl port-forward` process, start a fresh one with the command above, and hard-refresh the browser to clear stale cached JS bundles.
