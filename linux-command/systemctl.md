# To list running services with systemctl, you want to filter for services (--type=service) that are currently active (--state=running).

```
systemctl list-units --type=service --state=running
systemctl --type=service --state=running
```

# List ALL Active Services (Running or Exited):

```
systemctl list-units --type=service
```

# List ALL Installed Services (Running, Stopped, or Disabled)
```
systemctl list-unit-files --type=service
```

# Finding a Specific Service
```
systemctl --type=service --state=running | grep -i 'nginx\|apache'
```

# The Cleanup Process

## Stop the service

```
sudo systemctl stop your-service-name.service
```

## Disable the service
```
sudo systemctl disable your-service-name.service
```

## Delete the service files
```
sudo rm /etc/systemd/system/your-service-name.service
```

## Reload the systemd manager
```
sudo systemctl daemon-reload
```

## Reset failed states
```
sudo systemctl reset-failed
```
