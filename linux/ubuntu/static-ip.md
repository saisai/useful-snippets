# Identify Your Network Interface & Subnet
```
ip -br a
```

# Locate Your Netplan Config File
```
ls /etc/netplan/
```

```
cat /etc/netplan/50-cloud-init.yaml
network:
  version: 2
  ethernets:
    ens18:
      dhcp4: true
```


```
sudo nano /etc/netplan/50-cloud-init.yaml
network:
  version: 2
  ethernets:
    ens18:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8


sudo netplan try
sudo netplan apply
ip a show dev ens18
```
