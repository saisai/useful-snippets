
# Error response from daemon: conflict: unable to remove repository reference "postgres:15" (must force) - container d8c593fad145 is using its referenced image 9a18aed4ecdd


# Check whether it's running:
```
docker ps -a
```

```
docker ps -a --filter id=d8c593fad145
```

# If you no longer need it, remove it:
```
docker rm d8c593fad145
```

# If it's running, stop it first:
```
docker stop d8c593fad145
docker rm d8c593fad145
```

# Then remove the image:
```
docker rmi postgres:15
```

# Option 2: Force remove the image
```
docker rmi -f postgres:15
docker image rm -f postgres:15
```

# Option 3: Find all containers using the image
```
docker ps -a --filter ancestor=postgres:15
docker container ls -a --filter ancestor=postgres:15
```

# If your goal is simply to free disk space, you can also remove all unused containers and images:
```
docker system prune -a
```


# or remove only stopped containers:
```
docker container prune
```

# and then try:
```
docker rmi postgres:15
```