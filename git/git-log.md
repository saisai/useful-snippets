
```
git log --oneline --decorate=short
```

```
git show-ref --tags --heads
```

# To show short commit id, date and commit title
```
git log --oneline --date=short --pretty=format:"%h %ad %s"
```

# To view the code changed by commit id
```
git show -p 56d7cfd457
```

# To show graph with last 5 lines
```
 git log --oneline --graph --decorate -n 5
```

# To show all branchs
```
git log --oneline --graph --decorate --all -10
```