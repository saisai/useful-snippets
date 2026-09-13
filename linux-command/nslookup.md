# nslookup is a command-line tool 
used to query DNS (Domain Name System)
It lets you find the IP address of a domain, perform reverse lookups, and query specific DNS records.
```
nslookup google.com
```

Query a specific DNS server
```
nslookup google.com 8.8.8.8
```

Find the IP address (A record)
```
nslookup -type=A google.com
```

Find IPv6 address (AAAA record)
```
nslookup -type=AAAA google.com
```

Find MX (Mail Exchange) records
```
nslookup -type=MX gmail.com
```

Find NS (Name Server) records
```
nslookup -type=NS google.com
```

Find TXT records
```
nslookup -type=TXT google.com
```

Useful for checking:
- SPF
- DKIM
- Domain verification


Find CNAME
```
nslookup -type=CNAME www.github.com
```

Reverse DNS lookup
Given an IP address, find the hostname.
```
nslookup 8.8.8.8
```

Check if a domain resolves
```
nslookup example.com
```

Troubleshooting with different DNS servers
Compare results from different resolvers:
```
nslookup example.com 8.8.8.8
nslookup example.com 1.1.1.1
nslookup example.com 9.9.9.9
```
```
Common record types
Type	Purpose
A	    IPv4 address
AAAA	IPv6 address
MX	    Mail server
NS	    Name servers
TXT	    Text records (SPF, DKIM, verification)
CNAME	Canonical name (alias)
SOA	    Start of Authority
PTR	    Reverse DNS lookup
```