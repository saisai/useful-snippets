
(Link)[https://docs.docker.com/engine/install/ubuntu/]
```
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

```
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```
sudo systemctl status docker
```

```
sudo systemctl start docker
```

#Optional: Run Docker Without SudoBy default, Docker commands require root level privileges (sudo). If you usernamet to run Docker commands as a non-root user, add your current account to the Docker user group:

```
sudo usermod -aG docker ${USER}
```

```
newgrp docker

Create group: sudo groupadd docker
Assign user: sudo usermod -aG docker $USER
Refresh session: newgrp docker
Verify function: docker run hello-world
```

(link)[https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04]
(Githug)[https://github.com/joseeden/All-Things-Docker-and-Kubernetes/blob/master/pages/01-Pre-requisites/labs-docker-pre-requisites/05-Using-Docker-without-Root-permissions.md]