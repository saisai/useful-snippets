
# To install openssh

```
sudo pacman -S openssh git less
sudo pacman -S util-linux


sudo blkid
sudo lsblk -f

systemctl enable sshd.service 
systemctl start sshd.service

```

# how to install docker
```
sudo pacman -Syu docker vim
sudo pacman -S docker-compose docker-buildx
sudo reboot
```

# Configure Non-Root Access
```
sudo usermod -aG docker $USER
```

# Apply the group changes immediately without logging out
```
newgrp docker
```

# Troubleshot
```
journalctl -xeu docker.service
```


```
docker run -d -p 9000:9000 -v /root/portainer/data:/data -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer
```


# Remove related packages
```
sudo pacman -Rc php
```




https://gist.github.com/miguelmota/575af40ddb7f86b858a86a673cec3999
https://wiki.archlinux.org/title/OpenSSH