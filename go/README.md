
How to compile and build go from source 

```
cd ~/go-src/go

# Switch to the master branch
git checkout master

# Pull the latest commits
git pull origin master

cd src

# Set environment variables for the build
export CC=gcc
export GOROOT_BOOTSTRAP=$(go env GOROOT)

# Rebuild the toolchain
./make.bash

# This is usually unnecessary; stick to `../bin/go test ./time`
../bin/go test -v ./time/format_test.go ./time/format.go ./time/export_test.go


# 1. Navigate to the src directory
cd ~/go-src/go/src

# 2. Explicitly set GOROOT to the root of your source tree
# (This uses the absolute POSIX path, which MSYS2 translates correctly for the Windows go.exe)
export GOROOT=$(cd .. && pwd)

# 3. Clean the build cache to remove stale module data
../bin/go clean -cache


# Run the test using the package name
../bin/go test -v time -run Format

../bin/go test -bench=Format ./time

cd time
../../bin/go.exe test -test.fullpath=true -timeout 30s -run ^TestAppendInt$
../../bin/go.exe test -v -test.fullpath=true -timeout 30s -run ^TestFormat$
```