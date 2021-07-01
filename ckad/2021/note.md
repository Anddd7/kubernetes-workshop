- 安装flannel和calico时要注意`init --pod-network-cidr=xxx.xxx.xxx.xxx/16`的默认值
- 安装metric server `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`
  - 测试环境需要ignore tls validation: 下载`components.yaml`, 修改metric service的启动参数 + `--kubelet-insecure-tls`
  > Kubelet certificate needs to be signed by cluster Certificate Authority (or disable certificate validation by passing --kubelet-insecure-tls to Metrics Server)
