# portainer password
```
admin
rJy7KRSha64r6vvGXb0tnw

import secrets
secrets.token_urlsafe(16)

```

```
docker run -d -p 9000:9000 -v /root/portainer/data:/data -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer

```

(Link)[https://www.servethehome.com/creating-the-ultimate-virtualization-and-container-setup-with-management-guis/]

(video)[https://www.youtube.com/watch?v=_xnKMFuv9kc&list=PLC53fzn9608DcSu6RrrB8uVkkO3N69Y-1&index=5]