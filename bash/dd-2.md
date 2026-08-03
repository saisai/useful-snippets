```
dd if=/dev/zero of=/dev/sda bs=4M status=progress
500040728576 bytes (500 GB, 466 GiB) copied, 4479 s, 112 MB/s
dd: error writing '/dev/sda': No space left on device
119236+0 records in
119235+0 records out
500107862016 bytes (500 GB, 466 GiB) copied, 4482.4 s, 112 MB/s
dd if=/dev/zero of=/dev/sda bs=4M status=progress  3.85s user 1278.21s system 28% cpu 1:14:42.47 total
```

```
Everything ran completely normally here. What you are seeing is the expected textbook behavior when wiping a drive with dd.

Here is a breakdown of what those lines mean and why that error is actually a sign of success:
```

# The "Error": No space left on device
While it says "error", this is actually exactly what you want to see when zeroing out a drive.

Because you didn't specify a count= argument (which tells dd exactly when to stop), dd kept writing blocks of zeros (if=/dev/zero) to the drive (of=/dev/sda) until it hit the physical boundary of the disk. When it ran out of sectors to write to, the Linux kernel threw the No space left on device error, causing dd to stop. Your entire drive is now completely zeroed out.

# The Resource Usage (Zsh/Bash time stats)

- user (3.85s): The CPU spent almost no time executing code in user space because dd doesn't do complex processing; it just passes data.

- system (1278.21s): The CPU spent a significant amount of time in kernel space. This is because the kernel was heavily involved in managing the direct I/O data pipeline to the physical disk controller.

- cpu 28% / total 1:14:42.47: The process took 1 hour and 14 minutes, but it didn't max out your CPU because the operation was entirely I/O bound—the bottleneck was the physical write speed of the hard drive, not your processor.


Your drive is now completely clean, devoid of any partition tables (MBR/GPT) or filesystems, and ready to be partitioned anew.

```
root@archiso ~ # lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0    7:0    0 967.1M  1 loop /run/archiso/airootfs
sda      8:0    0 465.8G  0 disk
sdb      8:16   1  28.7G  0 disk
└─sdb1   8:17   1  28.7G  0 part /run/archiso/bootmnt
sdc      8:32   1     0B  0 disk
sdd      8:48   1     0B  0 disk
sde      8:64   1     0B  0 disk
sdf      8:80   1     0B  0 disk
sdg      8:96   1     0B  0 disk
```

```
root@archiso ~ # blkid
/dev/sdb1: LABEL="ARCH_202604" UUID="9ED7-6CB3" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="85969121-01"
/dev/loop0: BLOCK_SIZE="1048576" TYPE="squashfs"

```