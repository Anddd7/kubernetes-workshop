# Epic

- [ ] finish deploy Jenkinsfile
- [ ] finish lessions on Linux Academy
  - [x] Kubernetes quick start
    - [diagrams](https://interactive.linuxacademy.com/diagrams/KubernetesQuickStart.html)
  - [ ] Cloud Native Certified Kubernetes Administrator (CKA)
    - [diagrams](https://interactive.linuxacademy.com/diagrams/ThePodofMinerva.html)

# Difficulties

### network, dns and service discovery

pod ip: 只能用于pod间访问
- [`ping <pod ip>`时发生了什么](https://juejin.im/post/5da92ea55188253a8f7c495a)
  > pod -> veth0 -> docker0 -> flannel -> eth0 -> Other Node

[!img](images/overlay-network.png)

cluster ip: 只用于访问Service
- [虚拟IP实施](https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)

node ip: 节点的真实ip

# Summary

## Kubernetes quick start

快速扫盲贴, 最后是动手创建一个 cluster(类似在 vagrant 里面做的事)

## Cloud Native Certified Kubernetes Administrator (CKA)
