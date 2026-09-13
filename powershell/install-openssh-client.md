
Install / Enable OpenSSH Client on Windows 11 Alternatively, use PowerShell (run as Administrator):
```
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

# After installation, open PowerShell, Command Prompt, or Windows Terminal and type:

```
ssh
```

# Generate SSH Key Pair on Windows 11
## Recommended modern key type: ed25519 (faster and more secure).

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

After generation, you will have two files:

id_ed25519 → Private key (keep secret!)
id_ed25519.pub → Public key (this one you copy to the server)
```

# Copy Public Key to Linux Server (Passwordless Setup)
## Option A: Using PowerShell one-liner (Recommended)
```
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh user@server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

# Option B: Manual copy

## First connect with password:PowerShell
```
ssh user@server_ip
```

## On the Linux server, create the directory and file:Bash
```
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

## Copy the content of your public key (on Windows):PowerShell
```
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

## Paste it into the Linux server's ~/.ssh/authorized_keys file and set permissions:Bash
```
chmod 600 ~/.ssh/authorized_keys
```