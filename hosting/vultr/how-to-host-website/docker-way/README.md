# How to Build & Run for Host Nginx

# Build the Image

```
docker build -t my-flask-app:1.0 .
```

# Run the Container Bound to Localhost

```
docker run -d \
  --name flask-app \
  --restart unless-stopped \
  -p 127.0.0.1:5000:5000 \
  my-flask-app:1.0
```

# Verify Host Port Security:
# Check that port 5000 is bound strictly to 127.0.0.1 and not 0.0.0.0:

```
sudo netstat -tulpn | grep 5000
# OR
sudo ss -tulpn | grep 5000
```

# # 1. Symlink configuration if not already done
sudo ln -sf /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# 2. Verify Nginx configuration syntax
sudo nginx -t

# 3. Reload Nginx
sudo systemctl reload nginx