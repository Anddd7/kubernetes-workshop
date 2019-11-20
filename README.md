# Deploy your code in kubernetes

Go Go Go...

- [Deploy your code in kubernetes](#deploy-your-code-in-kubernetes)
  - [Standalone/Single Cluster](#standalonesingle-cluster)
    - [Prepare](#prepare)
    - [Deploy your first application](#deploy-your-first-application)
  - [Multiple-Nodes-Cluster](#multiple-nodes-cluster)
  - [Others](#others)

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

## Multiple-Nodes-Cluster

## Others
