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

## Others

## How to Production
