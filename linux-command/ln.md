# How to create soft link in nginx /etc/nginx/sites-available and /etc/nginx/sites-enabled/

## Navigate to the sites-enabled directory
```
cd /etc/nginx/sites-enabled/
```

## Create the soft link using sudo
```
sudo ln -s /etc/nginx/sites-available/yourdomain.com .
```

## Test the Nginx configuration
```
sudo nginx -t
```


## Reload Nginx to apply changes
```
sudo systemctl reload nginx
```

## How to verify it worked
```
ls -l /etc/nginx/sites-enabled
```