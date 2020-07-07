## On all 3 servers

### First, set up the Docker and Kubernetes repositories:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

cat << EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
```

### Install Docker and Kubernetes packages:

Note that if you want to use a newer version of Kubernetes, change the version installed for kubelet, kubeadm, and kubectl. Make sure all three use the same version.

> Note: There is currently a bug in Kubernetes 1.13.4 (and earlier) that can cause problems installaing the packages. Use 1.13.5-00 to avoid this issue.

```bash
sudo apt-get update

sudo apt-get install -y docker-ce=18.06.1~ce~3-0~ubuntu kubelet=1.14.5-00 kubeadm=1.14.5-00 kubectl=1.14.5-00

sudo apt-mark hold docker-ce kubelet kubeadm kubectl
```

### Enable iptables bridge call:

```bash
echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf

# sudo modprobe br_filter

sudo sysctl -p
```

## On the Kube master server

### Initialize the cluster:

```bash
# sudo nano /proc/sys/net/ipv4/ip_forward
# (Change from 0 to 1)

sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# it will print join command for workers
# kubeadm join 172.31.7.163:6443 --token w24wxw.ut3ac8osww82vdxy \
    # --discovery-token-ca-cert-hash sha256:fca40a7776fa1a93081f4ef00089024f70aba3ce4032012b2b11aec6c06919be
```

### Set up local kubeconfig:

```bash
mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### Install Flannel networking:

```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml
Note: If you are using Kubernetes 1.16 or later, you will need to use a newer flannel installation yaml instead:

kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/3f7d3e6c24f641e7ff557ebcea1136fdf4b1b6a1/Documentation/kube-flannel.yml
```

## On each Kube node server

Join the node to the cluster. Do this by copying the provided line from the output when initializing the master node. Keep in mind that when copying the command, the system will add a newline character if it stretches over multiple lines in the web terminal. To get around this, copy the command to a text editor and make sure it fits on one entire line. It should look something like the following:

```bash
sudo kubeadm join $controller_private_ip:6443 --token $token --discovery-token-ca-cert-hash $hash
```

## On the Kube master server

Verify that all nodes are joined and ready:

```bash
kubectl get nodes
```

You should see all three servers with a status of Ready:

```bash
NAME                      STATUS   ROLES    AGE   VERSION
wboyd1c.mylabserver.com   Ready    master   54m   v1.13.4
wboyd2c.mylabserver.com   Ready    <none>   49m   v1.13.4
wboyd3c.mylabserver.com   Ready    <none>   49m   v1.13.4
```
