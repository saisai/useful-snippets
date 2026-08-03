
```
fdisk -l /dev/sda
Disk /dev/sda: 931.51 GiB, 1000204886016 bytes, 1953525168 sectors
Disk model: ST1000DM010-2EP1
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes

fdisk /dev/sda
Command (m for help): g

Created a new GPT disklabel (GUID: 0D42379C-26BB-4235-9FF5-1F5A274170FB).

Command (m for help): n
Partition number (1-128, default 1):
First sector (2048-1953525134, default 2048):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-1953525134, default 1953523711): +100G

Created a new partition 1 of type 'Linux filesystem' and of size 100 GiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.

root@pve:~# fdisk -l /dev/sda
Disk /dev/sda: 931.51 GiB, 1000204886016 bytes, 1953525168 sectors
Disk model: ST1000DM010-2EP1
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: 0D42379C-26BB-4235-9FF5-1F5A274170FB

Device     Start       End   Sectors  Size Type
/dev/sda1   2048 209717247 209715200  100G Linux filesystem


 mkfs.ext4 /dev/sda1
mke2fs 1.47.2 (1-Jan-2025)
Creating filesystem with 26214400 4k blocks and 6553600 inodes
Filesystem UUID: d081d084-d214-459d-8009-4a02864a5572
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000, 7962624, 11239424, 20480000, 23887872

Allocating group tables: done
Writing inode tables: done
Creating journal (131072 blocks): done
Writing superblocks and filesystem accounting information: done

```