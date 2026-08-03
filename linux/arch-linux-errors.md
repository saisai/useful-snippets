# Error
```
error: openh264: signature from "Daniel Bermond <dbermond@archlinux.org>" is marginal trust
:: File /var/cache/pacman/pkg/openh264-2.6.0-2-x86_64.pkg.tar.zst is corrupted (invalid or corrupted package (PGP signature)).
Do you want to delete it? [Y/n] y
error: failed to commit transaction (invalid or corrupted package)
Errors occurred, no packages were upgraded.

```

```
# 1. Update the keyring package specifically
sudo pacman -Sy archlinux-keyring

# 2. Re-run your full system upgrade
sudo pacman -Syu
```

```
(18/20) Checking for old perl modules...
WARNING: '/usr/lib/perl5/5.38' contains data from at least 2 packages which will NOT be used by the installed perl interpreter.
 -> Run the following command to get a list of affected packages: pacman -Qqo '/usr/lib/perl5/5.38'

```