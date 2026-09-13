
See the diff introduced by the latest pull
```
git diff ORIG_HEAD..HEAD
```

# See only that specific file
```
git diff ORIG_HEAD..HEAD -- src/crypto/x509/test.py
```

# See a summary first
```
git diff --stat ORIG_HEAD..HEAD
```

# Then inspect the full changes:
```
git diff ORIG_HEAD..HEAD
```

# If the pull created a merge commit
```
git show --stat
```

# Useful workflow
```
git pull

# Summary of what changed
git diff --stat ORIG_HEAD..HEAD

# Full diff
git diff ORIG_HEAD..HEAD

# Specific file
git diff ORIG_HEAD..HEAD -- src/crypto/x509/test.py
```

# Use --name-only instead
```
for f in $(git diff --name-only ORIG_HEAD..HEAD); do
    git diff ORIG_HEAD..HEAD -- "$f"
done
```

# Better: let Git handle filenames safely

If filenames can contain spaces, use:

```
git diff --name-only -z ORIG_HEAD..HEAD |
while IFS= read -r -d '' f; do
    git diff ORIG_HEAD..HEAD -- "$f"
done
```


# After git pull, show me all the actual changes file-by-file
```
git diff ORIG_HEAD..HEAD
```

```
for f in $(git diff --name-only ORIG_HEAD..HEAD); do
    echo
    echo "========== $f =========="
    git diff ORIG_HEAD..HEAD -- "$f"
done
```