
# How to remove postgresql in arch linux
```
sudo systemctl stop postgresql
sudo systemctl disable postgresql
sudo pacman -Rns postgresql
```

# Wipe All Database Data (Destructive)
```
sudo rm -rf /var/lib/postgres/
```