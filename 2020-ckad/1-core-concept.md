## Creating Pods

```bash
kubectl create -f my-pod.yml

# 更新
vi my-pod.yml
kubectl apply -f my-pod.yml

# 修改(直接修改运行的pod配置)
kubectl edit po my-pod

kubectl delete po my-pod
```

## Namespaces

```bash
kubectl get ns
# default           Active   117m
# kube-node-lease   Active   117m
# kube-public       Active   117m
# kube-system       Active   117m
```

> 不指定ns时, 只会显示default里的资源

## Basic Container Configuration
