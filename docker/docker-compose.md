## Run docker in background
```
docker compose up -d --build
```

```
docker compose up -d
```

```
docker volume ls
```

# Stop the container
```
docker compose down
```

# List volumes
```
docker compose volumes
DRIVER    VOLUME NAME
local     docker-compose-file_postgres_data

```

# inspect
```
 docker inspect docker-compose-file_postgres_data
```


# List running docker
```
docker compose ps -a
```

# To access the container
```
docker compose exec servicename bash
```

# Build images
```
docker compose down
docker compose up -d --build
```

# Update a specific service only
```
docker compose up -d --build <service_name>
```

# Bonus Tip (Clean Up): Repeatedly rebuilding images will leave behind old, unnamed images known as "dangling images". You can reclaim disk space at any time by running:
```
docker image prune -f
```