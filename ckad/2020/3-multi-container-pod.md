## Pods Communication

Shared Network
Shared Volume
Shared Process Namespace

## [Design Pattern of multi conatiner pods](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns/)

- Sidecar Pod

  - Main Container
  - Sidecar Container: automation process/enhance

- Ambassador Pod

  - Ambassador: forward/format input
  - Main

- Adapter Pod
  - Main
  - Adapter: format output

### Forwarding Port Traffic with an Ambassador Container

在 pod 内放置一个 Ambassador container, 将流量从 80 导到 8775

- 利用 ConfigMap 注册配置文件: 非常方便, 比通过 volume 动态绑定强太多了

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fruit-service-ambassador-config
data:
  haproxy.cfg: |-
    global
        daemon
        maxconn 256

    defaults
        mode http
        timeout connect 5000ms
        timeout client 50000ms
        timeout server 50000ms

    listen http-in
        bind *:80
        server server1 127.0.0.1:8775 maxconn 32
```

- 创建 multi-container-pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fruit-service
spec:
  containers:
    - name: legacy-fruit-service
      image: linuxacademycontent/legacy-fruit-service:1
    - name: haproxy-ambassador
      image: haproxy:1.7
      ports:
        - containerPort: 80
      volumeMounts:
        - name: config-volume
          mountPath: /usr/local/etc/haproxy
  volumes:
    - name: config-volume
      configMap:
        name: fruit-service-ambassador-config
```
