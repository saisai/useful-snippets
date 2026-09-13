Permanently overwrites the entire /dev/sda disk with zeros
```
dd if=/dev/zero of=/dev/sda bs=4M status=progress
923082424320 bytes (923 GB, 860 GiB) copied, 5313 s, 174 MB/s
```

#Breakdown
*sudo – Run as root.
*dd – Low-level disk copy utility.
*if=/dev/zero – Input file is an endless stream of zero bytes.
*of=/dev/sda – Output is the entire disk /dev/sda.
*bs=4M – Read/write in 4 MiB blocks for better performance.
*status=progress – Display progress while writing.
#What happens
Deletes all partitions.
Erases the partition table (MBR/GPT).
Removes all filesystems.
Makes the disk appear blank/uninitialized.
Data recovery becomes much more difficult than simply deleting files, though specialized forensic recovery may still recover some data depending on the storage device and how much has been overwritten.
Before running

Verify the correct disk:


```
lsblk

fdisk -l 
```

dd if=/dev/zero of=/dev/sda bs=4M status=progress
1000127594496 bytes (1.0 TB, 931 GiB) copied, 6012 s, 166 MB/s
dd: error writing '/dev/sda': No space left on device
238468+0 records in
238467+0 records out
1000204886016 bytes (1.0 TB, 932 GiB) copied, 6040.29 s, 166 MB/s
dd if=/dev/zero of=/dev/sda bs=4M status=progress  0.41s user 451.08s system 7% cpu 1:40:40.32 total


```
 hexdump -C -n 512 /dev/sda
00000000  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000200
```

means:

✅ The first 512 bytes (the first sector) contain only 0x00 bytes.
✅ The * is hexdump's shorthand indicating that all omitted lines are identical (all zeros).
✅ The Master Boot Record (MBR) or GPT protective MBR has been erased.
✅ There is no bootloader or partition table remaining in the first sector.

Combined with your previous outputs:

dd wrote approximately 1,000,124,885,496 bytes before reaching the end of the disk.
fdisk -l /dev/sda shows only the disk information and no partitions.
hexdump shows the first sector is all zeros.

These are exactly what you would expect after successfully running:

```
sudo dd if=/dev/zero of=/dev/sda bs=4M status=progress
```


# Optional: Check the end of the disk
If you usernamet to be extra thorough, you can also inspect the last sector to confirm it was overwritten.

```
blockdev --getsz /dev/sda
```

This prints the total number of 512-byte sectors. Suppose it returns:
```
1953525168
```

# Then inspect the last sector:

```
dd if=/dev/sda bs=512 skip=1953525167 count=1 2>/dev/null | hexdump -C
```

If you again see all 00 bytes, that confirms both the beginning and the end of the disk were overwritten.

Based on everything you've shared, however, there is already strong evidence that the entire 1 TB disk was successfully zeroed.


```
Disk /dev/sda: 931.51 GiB, 1000204886016 bytes, 1953525168 sectors
Disk model: ST1000DM010-2EP1
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
```

Notice what's missing:

❌ No Disklabel type: gpt
❌ No Disklabel type: dos
❌ No Disk identifier
❌ No partition entries (such as /dev/sda1, /dev/sda2)


# One more optional verification
You can check whether any filesystem signatures remain:
```
wipefs /dev/sda
```
If it produces no output, that means no known filesystem or partition signatures are detected.

Or inspect the partition table directly:

```
parted /dev/sda print
```