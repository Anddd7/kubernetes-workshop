# Deploy your code in kubernetes

Go Go Go...

- [Deploy your code in kubernetes](#deploy-your-code-in-kubernetes)
- [Standalone/Single Cluster](#standalonesingle-cluster)
  - [Prepare](#prepare)
  - [Deploy your first application](#deploy-your-first-application)
    - [Resources of k8s](#resources-of-k8s)
    - [Deploy with kubernetes](#deploy-with-kubernetes)
- [Multiple-Nodes-Cluster](#multiple-nodes-cluster)
- [Sharp Weapons](#sharp-weapons)
  - [Helm: The package manager for Kubernetes](#helm-the-package-manager-for-kubernetes)
  - [Kubernetes Dashboard](#kubernetes-dashboard)
    - [kubectl proxy](#kubectl-proxy)
    - [secret](#secret)
  - [Monitoring with Prometheus/Grafana/Alertmanager](#monitoring-with-prometheusgrafanaalertmanager)
    - [port forward](#port-forward)
  - [Tracking/Logging with ELK stack](#trackinglogging-with-elk-stack)
  - [Jenkins (Auto scaling slave)](#jenkins-auto-scaling-slave)
- [How to Production](#how-to-production)
  - [Initial your server](#initial-your-server)

# Standalone/Single Cluster

## Prepare

MacOS

You have 2 ways to set up kubernetes in your desktop.

- Docker Desktop
  - upgrade your Docker Desktop to latest
  - install/enable kubernetes in Docker Desktop
  - check your cluster `kubectl version`

* minikube (a small VM)
  ```bash
  brew install minikube
  # brew reinstall minikube
  minikube start
  minikube ssh
  $minikube kubectl get nodes
  ```

Linux

- [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Deploy your first application

docker stack with docker compose

- write docker compose, and set [deploy configuration](https://docs.docker.com/compose/compose-file/)
- deploy into k8s: `docker stack deploy --compose-file=docker-compose.yml simple-app`
- check status: `kubectl get pod` | `kubectl get svc` | `kubectl get deployment`

### Resources of k8s

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

### Deploy with kubernetes

- (optional) convert docker compose with [kompose](https://github.com/kubernetes/kompose)
- write configuration file, then: `kubectl apply -f kubernetes.yml`

# Multiple-Nodes-Cluster

Vagrant (ref `Vagrantfile`)

- install docker
- install kubectl
- install kubeadm (master)
  - copy config file to node
- run: `vagrant ssh k8s-master`/`kubectl get nodes`

# Sharp Weapons

## Helm: The package manager for Kubernetes

packaged kubernetes application (contains full configuration)

- [install and initial](https://helm.sh/docs/intro/install/)
- deploy chart with `helm install <name> <chart_name> -n <namespace>`
- list `helm list --all-namespaces`

## Kubernetes Dashboard

a fancy and multifunction dashboard

```bash
# install with recommended config
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta6/aio/deploy/recommended.yaml

# install with helm (recommended)
helm install kubernetes-dashboard stable/kubernetes-dashboard -n kubernetes-dashboard

# install with customized config (expose with node port)
kubectl apply -f k8s-dashboard.yml
```

### kubectl proxy

kubernetes proxy will expose inner service to 8081, can access services with:

```bash
kubectl proxy
# kubectl proxy --address 0.0.0.0 --accept-hosts '.*'
```

access the service with: `http://<kubernetes_master_address>/<api>/v1/namespaces/<namespace_name>/services/[https:]<service_name>:<port_name></port_name>/proxy`

e.g Dashboard: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:https/proxy

### secret

Don't forget get the secret of dashboard from `kubectl get secrets`

## Monitoring with Prometheus/Grafana/Alertmanager

a lot of super fancy dashboards

```bash
# 全家桶 with helm
helm install prometheus-operator stable/prometheus-operator -n monitoring

kubectl get pods -n monitoring
kubectl get svc -n monitoring

# proxy (tips: need to modify helm config to redirect grafana api)
kubectl proxy
curl http://localhost:8001/api/v1/namespaces/monitoring/services/prometheus-operator-prometheus:web/proxy/
```

[More detals](https://itnext.io/kubernetes-monitoring-with-prometheus-in-15-minutes-8e54d1de2e13)

### port forward

expose pod's port to node's port

```bash
# port-forward
kubectl port-forward -n monitoring <pod> <port>

# edit and expose service with node port
kubectl edit svc <service_name>
```

## Tracking/Logging with ELK stack

```bash
# 一键安装
helm install elk stable/elastic-stack -n elk
```

## Jenkins (Auto scaling slave)

```bash
# 一键安装
helm install jenkins stable/jenkins -n jenkins
```

**config a multiple stage pipeline**

```Jenkinsfile
node {
    stage('Hello') {
        echo 'Hello'
    }
    stage('Processing') {
        echo 'Processing'
    }
    stage('Finished') {
        echo 'Finished'
    }
}
```

**check kubernetes cluster**

```console
NAME                       READY   STATUS    RESTARTS   AGE
default-frbl9              1/1     Running   0          10s
jenkins-74ccbf79d6-b6v7r   1/1     Running   1          2d
```

# How to Production

**target: build a pipeline to deploy your code to kubernetes cluster with different environment**

_关于 AWS EKS 的部分只是通过采访和脑补进行的架构设计, 还未进行过实践._

## Initial your server

kops
eksctl
terraform
ansible
kubeadm
