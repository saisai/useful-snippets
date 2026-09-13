
Formatting a USB drive completely wipes all data on it and sets up a fresh file system. In Windows, you can do this quickly using either the graphical interface or the command line

- 1.Right-click the Start menu and select Terminal (Admin) or Command Prompt (Admin).

- 2.Type diskpart and press Enter.

- 3.Run the following commands one by one:

```
diskpart
list disk
select disk x
list disk
clean
create partition primary
format fs=exfat quick
(You can change exfat to ntfs if you prefer).
```