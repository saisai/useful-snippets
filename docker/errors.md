
No spacke left to move Docker's data directory:
```
sudo systemctl stop docker
sudo mv /var/lib/docker /home/docker
```

# Then create /etc/docker/daemon.json:
```
{
  "data-root": "/home/docker"
}
```

# Restart docker
```
sudo systemctl start docker
```