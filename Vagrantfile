# -*- mode: ruby -*-
# vi: set ft=ruby :

servers = [
    {
        :name => "k8s-master",
        :type => "master",
        :box => "ubuntu/xenial64",
        :box_version => "20191108.0.0",
        :eth1 => "192.168.205.10",
        :mem => "2048",
        :cpu => "2"
    },
    {
        :name => "k8s-node",
        :type => "node",
        :box => "ubuntu/xenial64",
        :box_version => "20191108.0.0",
        :eth1 => "192.168.205.11",
        :mem => "2048",
        :cpu => "2"
    }
]

# This script to install k8s using kubeadm will get executed after a box is provisioned
$configureBox = <<-SCRIPT
    echo "-------\nset docker repository\n-------"
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable"

    echo "-------\ninstall docker\n-------"
    apt-get update && apt-get -y install docker-ce=18.06.2~ce~3-0~ubuntu

    echo "-------\nsetup docker daemon\n-------"
    cat > /etc/docker/daemon.json <<EOF
    {
        "exec-opts": ["native.cgroupdriver=systemd"],
        "log-driver": "json-file",
        "log-opts": {
            "max-size": "100m"
        },
        "storage-driver": "overlay2"
    }
EOF
    mkdir -p /etc/systemd/system/docker.service.d

    echo "-------\nrun docker commands as vagrant user\n-------"
    usermod -aG docker vagrant

    echo "-------\nset kube repository\n-------"
    apt-get install -y apt-transport-https curl
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
    deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
    
    echo "-------\ninstall kubernetes\n-------"
    apt-get update && apt-get install -y kubelet kubeadm kubectl
    apt-mark hold kubelet kubeadm kubectl

    echo "-------\nkubelet requires swap off\n-------"
    swapoff -a
    sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

    echo "-------\nset node-ip\n-------"
    IP_ADDR=`ifconfig enp0s8 | grep Mask | awk '{print $2}'| cut -f2 -d:`

    sudo sh -c 'echo KUBELET_EXTRA_ARGS= >> /etc/default/kubelet'
    sudo sed -i "/^[^#]*KUBELET_EXTRA_ARGS=/c\KUBELET_EXTRA_ARGS=--node-ip=$IP_ADDR" /etc/default/kubelet
   
    echo "-------\nrestart docker & kube\n-------"
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    sudo systemctl restart kubelet

    echo "-------\nopen the port\n-------"
    iptables -A FORWARD -j ACCEPT
SCRIPT

$configureMaster = <<-SCRIPT
    echo "-------\nThis is master\n-------"

    echo "-------\ninstall k8s master\n-------"
    IP_ADDR=`ifconfig enp0s8 | grep Mask | awk '{print $2}'| cut -f2 -d:`
    HOST_NAME=$(hostname -s)

    kubeadm init --apiserver-advertise-address=$IP_ADDR --apiserver-cert-extra-sans=$IP_ADDR  --node-name $HOST_NAME --pod-network-cidr=172.16.0.0/16

    echo "-------\ncopying credentials to regular user - vagrant\n-------"
    sudo --user=vagrant mkdir -p /home/vagrant/.kube
    cp -i /etc/kubernetes/admin.conf /home/vagrant/.kube/config
    chown $(id -u vagrant):$(id -g vagrant) /home/vagrant/.kube/config

    echo "-------\ninstall calico network addon\n-------"
    export KUBECONFIG=/etc/kubernetes/admin.conf
   
    kubectl apply -f https://docs.projectcalico.org/v3.10/manifests/calico.yaml

    echo "-------\ncreate token and join script\n-------"
    kubeadm token create --print-join-command >> /etc/kubeadm_join_cmd.sh
    chmod +x /etc/kubeadm_join_cmd.sh

    echo "-------\nrequired for setting up password less ssh between guest VMs\n-------"
    sudo sed -i "/^[^#]*PasswordAuthentication[[:space:]]no/c\PasswordAuthentication yes" /etc/ssh/sshd_config
    sudo service sshd restart

SCRIPT

$configureNode = <<-SCRIPT
    echo "-------\nThis is worker\n-------"

    echo "-------\ninstall kube node\n-------"
    apt-get install -y sshpass
    sshpass -p "vagrant" scp -o StrictHostKeyChecking=no vagrant@192.168.205.10:/etc/kubeadm_join_cmd.sh .
    sh ./kubeadm_join_cmd.sh

SCRIPT

Vagrant.configure("2") do |config|
    servers.each do |opts|
        config.vm.define opts[:name] do |config|

            config.vm.box = opts[:box]
            config.vm.box_version = opts[:box_version]
            config.vm.hostname = opts[:name]
            config.vm.network :private_network, ip: opts[:eth1]

            config.vm.provider "virtualbox" do |v|
             
                v.name = opts[:name]
            	v.customize ["modifyvm", :id, "--groups", "/Ballerina Development"]
                v.customize ["modifyvm", :id, "--memory", opts[:mem]]
                v.customize ["modifyvm", :id, "--cpus", opts[:cpu]]
            end

            config.vm.provision "shell", inline: $configureBox

            if opts[:type] == "master"
                config.vm.provision "shell", inline: $configureMaster
            else
                config.vm.provision "shell", inline: $configureNode
            end
        end
    end
end 