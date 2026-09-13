# Make the current user own everything 

inside the folder (and the folder itself):
```
sudo chown -R $USER ~/.blabla
```

If you also usernamet to change the group using the same user, you can:
```
sudo chown -R $USER:$USER ~/.blabla
```