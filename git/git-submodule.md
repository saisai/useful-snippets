
From the parent repository
First see your submodules:

```
git submodule status
```

## Check status of all submodules

You don't need to enter each one manually:
```
git submodule foreach 'git status --short'
```

For more detailed status:
```
git submodule foreach 'git status'
```

## Quick command

If you know the submodule path:

```
git -C subfolderr status
```

And to see its current branch:
```
git -C subfolder branch --show-current
```
or both
```
git -C subfolder status --short --branch
```

## Show logs for all submodules
```
git submodule foreach 'echo "===== $name ====="; git log --oneline -10'
```

## Show full log instead of only 10 commits
```
git submodule foreach 'echo "===== $name ====="; git log'
```

## Show the logs of exactly 3 folders
```
for dir in one two three; do
    echo "===== $dir ====="
    git -C "$dir" log --oneline -10
done
```

## Include branch/status information
```
git submodule foreach 'echo "===== $name ====="; git status --short --branch; git log --oneline -5'

git submodule foreach 'echo "===== $name ====="; git status --short --branch; git log --oneline -10'
```

## To show date + author + commit hash + commit message for all submodules:
```
git submodule foreach 'echo "===== $name ====="; git log -10 --date=format:"%Y-%m-%d %H:%M:%S" --pretty=format:"%h | %ad | %an | %s"; echo'
```

## Shorter date
```
git submodule foreach 'echo "===== $name ====="; git log -10 --date=short --pretty=format:"%h | %ad | %an | %s"; echo'
```

If you usernamet the full Git log format
```
git submodule foreach 'echo "===== $name ====="; git log -10 --pretty=fuller'
```

## You can include the submodule name + branch + date + author + commit hash + message:
```
git submodule foreach 'echo "===== $name ====="; echo "Branch: $(git branch --show-current)"; git log -10 --date=short --pretty=format:"%h | %ad | %an | %s"; echo'
```

## Better: include branch + upstream + ahead/behind
```
git submodule foreach '
echo "===== $name ====="
git status --short --branch
git log -10 --date=short --pretty=format:"%h | %ad | %an | %s"
echo
'
```
