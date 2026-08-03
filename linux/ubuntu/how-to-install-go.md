
# Step 1: Download the Go 1.26 Tarball
```
wget https://go.dev/dl/go1.26.0.linux-amd64.tar.gz
```

# Step 2: Extract the Toolchain
```
sudo tar -C /usr/local -xzf go1.26.0.linux-amd64.tar.gz
```


# Step 3: Configure Environment Variables
```
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin' >> ~/.bashrc
source ~/.bashrc

```