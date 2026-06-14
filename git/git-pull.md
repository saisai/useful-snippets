```bash
git pull
Updating 1accfd5..b22e649
Fast-forward
 hellofolder | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## Breakdown

### Updating `1accfd5..b22e649`

- Your local branch was at commit `1accfd5`.
- After pulling, it moved to commit `b22e649`.

### Fast-forward

- Git did not create a merge commit.
- Your local branch had no unique commits that conflicted with the remote branch.
- Git simply moved the branch pointer forward to the newer commit.

### `hellofolder | 2 +-`

This indicates changes in the file named `hellofolder`:

- `2` = two lines were modified.
- `+-` = one line was added and one line was removed.

### `1 file changed, 1 insertion(+), 1 deletion(-)`

- One file was modified.
- One line was added.
- One line was removed.


# Check if the commit exists

```
git rev-parse b22e649
```

# Inspect the pulled commit with
```
git log --oneline -1
git show HEAD
```

# Check whether you're inside the correct repository
```
git rev-parse --show-toplevel
```

# Show short commit head 
```
git rev-parse --short HEAD
```