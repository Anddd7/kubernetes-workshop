## ConfigMaps

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config-map
data:
  myKey: myValue
  anotherKey: anotherValue
```

### env variable from config map

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-configmap-pod
spec:
  containers:
    - name: myapp-container
      image: busybox
      command: ["sh", "-c", "echo $(MY_VAR) && sleep 3600"]
      env:
        - name: MY_VAR
          # get value from config map
          valueFrom:
            configMapKeyRef:
              # config map name
              name: my-config-map
              # key name
              key: myKey
```

### config map as volume

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-configmap-volume-pod
spec:
  containers:
    - name: myapp-container
      image: busybox
      command: ["sh", "-c", "echo $(cat /etc/config/myKey) && sleep 3600"]
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      # define a volume supported by config map
      configMap:
        name: my-config-map
```

#### keys in mapped volume

**config map** 的 `key:value` 会映射成 **volume** 里的 `file:content`

```bash
kubectl exec my-configmap-volume-pod -- ls /etc/config
# anotherKey
# myKey
kubectl exec my-configmap-volume-pod -- cat /etc/config/myKey
# myValue
kubectl exec my-configmap-volume-pod -- cat /etc/config/anotherKey
# anotherValue
```

## SecurityContexts

**Root User**, container 内默认会使用 root 用户执行 command, 可能会造成一些安全问题(container 被攻破, 操作宿主机的文件/进程)

可以通过设置 SecurityContexts, 限制 container 运行的用户

```bash
sudo useradd -u 2000 container-user-0
sudo groupadd -g 3000 container-group-0
sudo useradd -u 2001 container-user-1
sudo groupadd -g 3001 container-group-1
sudo mkdir -p /etc/message/
echo "Hello, World!" | sudo tee -a /etc/message/message.txt
sudo chown 2000:3000 /etc/message/message.txt
sudo chmod 640 /etc/message/message.txt
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-securitycontext-pod
spec:
  securityContext:
    runAsUser: 2000
    fsGroup: 3000
  #   Permission Denied
  #   securityContext:
  #     runAsUser: 2001
  #     fsGroup: 3001
  containers:
    - name: myapp-container
      image: busybox
      command: ["sh", "-c", "cat /message/message.txt && sleep 3600"]
      volumeMounts:
        - name: message-volume
          mountPath: /message
  volumes:
    - name: message-volume
      hostPath:
        path: /etc/message
```

## [Resource Requirements](https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-resource-requests-and-limits)

(Kubernetes Scheduler do this)

- requests: Pod 运行所需要的最小资源: k8s 根据需求来决定 Pod 应该被分到哪一个 Node 上执行(满足运行需求)
- limits: Pod 最大可占用的资源

tips:

- 如果 Request 超过 Node 所能提供的值, Pod 永远不会被 scheduled
- 超过 limits 后, k8s 会开始"挤压/限制"pod 的运行, 来达到限制 CPU/Mem 的功能
  - CPU: throttle
  - Mem: terminal low priority pods, oom killer

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-resource-pod
spec:
  containers:
    - name: myapp-container
      image: busybox
      command: ["sh", "-c", "echo Hello Kubernetes! && sleep 3600"]
      resources:
        requests:
          memory: "64Mi" # 64 MiB
          cpu: "250m" # 0.25 cores
        limits:
          memory: "128Mi"
          cpu: "500m"
```

资源限制 ref:

- https://k8smeetup.github.io/docs/tasks/administer-cluster/cpu-memory-limit/#%E6%B8%85%E7%90%86
- https://www.cnblogs.com/sunsky303/p/11544540.html

## [Secrets](https://kubernetes.io/zh/docs/concepts/configuration/secret/)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
stringData:
  myKey: myPassword
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-secret-pod
spec:
  containers:
    - name: myapp-container
      image: busybox
      command: ["sh", "-c", "echo Hello, Kubernetes! && sleep 3600"]
      env:
        - name: MY_PASSWORD
          valueFrom:
            secretKeyRef:
              name: my-secret
              key: myKey
```

## ServiceAccount

```bash
kubectl create serviceaccount my-serviceaccount
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-serviceaccount-pod
spec:
# 使用service account
  serviceAccountName: my-serviceaccount
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', "echo Hello, Kubernetes! && sleep 3600"]
```