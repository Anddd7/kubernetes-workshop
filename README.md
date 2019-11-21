# Deploy your code in kubernetes

Go Go Go...

- [Deploy your code in kubernetes](#deploy-your-code-in-kubernetes)
  - [Standalone/Single Cluster](#standalonesingle-cluster)
    - [Prepare](#prepare)
    - [Deploy your first application](#deploy-your-first-application)
      - [Resources of k8s](#resources-of-k8s)
      - [Deploy with kubernetes](#deploy-with-kubernetes)
  - [Multiple-Nodes-Cluster](#multiple-nodes-cluster)
  - [Others](#others)
    - [Helm: The package manager for Kubernetes](#helm-the-package-manager-for-kubernetes)
    - [Kubernetes Dashboard](#kubernetes-dashboard)
      - [kubectl proxy](#kubectl-proxy)
      - [secret](#secret)
    - [Monitoring with Prometheus/Grafana/Alertmanager](#monitoring-with-prometheusgrafanaalertmanager)
  - [How to Production](#how-to-production)

## Standalone/Single Cluster

### Prepare

MacOS

You have 2 ways to set up kubernetes in your desktop.

- Docker Desktop
  - upgrade your Docker Desktop to latest
  - install/enable kubernetes
  - just run `kubectl version`
- minikube (a small VM)
  - `brew install minikube`/`brew reinstall minikube`
  - `minikube start`
  - `minikube ssh`
  - `kubectl get nodes`

Linux

- [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Deploy your first application

docker stack with docker compose

- [deploy configuration](https://docs.docker.com/compose/compose-file/)
- deploy into k8s `docker stack deploy --compose-file=docker-compose.yml simple-app`
- check status `kubectl get pod`/`kubectl get svc`/`kubectl get deployment`

#### Resources of k8s

Pod:

- 最小部署单元
- 由 1~n 个共享资源(volume,ports)的容器组成, 可以通过 localhost 访问彼此
- 异常终止无法自动恢复

ReplicaSet:

- define pod template
- 副本控制, auto scale to expected replicas
- 滚动升级, 自动调整 Pod 配置和副本数量

Deployment:

- 升级版 RS, has deploy status

Service:

- network management
- load balancing
- expose port

#### Deploy with kubernetes

- (optional) convert docker compose with [kompose](https://github.com/kubernetes/kompose)
- write configuration file
- `kubectl apply -f kubernetes.yml`

## Multiple-Nodes-Cluster

Vagrant (ref `Vagrantfile`)

- install docker
- install kubectl
- install kubeadm (master)
  - copy config file to node
- `vagrant ssh k8s-master`/`kubectl get nodes`

## Others

### Helm: The package manager for Kubernetes

packaged kubernetes application (contains full configuration)

- [install and initial](https://helm.sh/docs/intro/install/)

### Kubernetes Dashboard

- install with recommended config
  `kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta6/aio/deploy/recommended.yaml`
- install with helm
  `helm install stable/kubernetes-dashboard --name my-kubernetes-dashboard`
- install with customized config (expose with node port)
  `kubectl apply -f k8s-dashboard.yml`
- access with proxy

#### kubectl proxy
> kubernetes proxy will expose inner service to 8081, can access services with:
> `kubectl proxy`/`kubectl proxy --address 0.0.0.0 --accept-hosts '.*'`
> `http://<kubernetes_master_address>/<api>/v1/namespaces/<namespace_name>/services/[https:]<service_name>:[port_name]/proxy`
> e.g dashboard: `http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/`

#### secret
> You can get the secrets from dashboard or `kubectl get secrets`

### Monitoring with Prometheus/Grafana/Alertmanager

[More detals](https://itnext.io/kubernetes-monitoring-with-prometheus-in-15-minutes-8e54d1de2e13)

- install all with one line: `helm install prometheus-operator stable/prometheus-operator -n monitoring`
- access with 
  - port-forward: `kubectl port-forward -n monitoring <pod> <port>`
  - modify the service: `kubectl edit svc <>`
  - by proxy with service and port name:
    - `prometheus-operator-prometheus:web`/`prometheus-operator-grafana:service`/`prometheus-operator-alertmanager:web`
    - (tips) need to modify helm config to redirect grafana api

## How to Production
