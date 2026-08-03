
# Finding a Specific Port

```
sudo ss -tulnp | grep :8080
```

# Using lsof (List Open Files):
```
sudo lsof -i :8080
```