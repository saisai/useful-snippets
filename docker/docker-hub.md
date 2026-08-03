

```
docker login -u acmecorp
```

```
docker login -u acmecorp

i Info → A Personal Access Token (PAT) can be used instead.
         To create a PAT, visit https://app.docker.com/settings


Password:

WARNING! Your credentials are stored unencrypted in '/home/acmecorp/.docker/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

Login Succeeded
```

# 2.Build the Production Image:Target Dockerfile.prod explicitly.Build your image using your production Dockerfile (Dockerfile.prod). Give it a primary tag corresponding to your exact semantic version:

```
docker build -f Dockerfile.prod -t acmecorp/myapp:2.4.1 .
```

# 3.Apply Additional Version Tags
```
# Major & Minor versions (auto-updated on patch releases)
docker tag acmecorp/myapp:2.4.1 acmecorp/myapp:2.4
docker tag acmecorp/myapp:2.4.1 acmecorp/myapp:2

# Git Commit SHA for exact build traceability
docker tag acmecorp/myapp:2.4.1 acmecorp/myapp:sha-a1b2c3d

# Floating latest tag for production-ready status
docker tag acmecorp/myapp:2.4.1 acmecorp/myapp:latest
```

```
docker build -f Dockerfile.prod -t acmecorp/myapp:2.4.1 .
docker tag acmecorp/myapp:2.4.1 acmecorp/myapp:latest
```

# 4.Push All Tags to Docker Hub:
Push all created tags to your remote registry in one command:
```
docker push --all-tags acmecorp/myapp
```