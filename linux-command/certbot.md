sudo certbot --nginx -d blog.domainname.xyz
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for blog.domainname.xyz

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/blog.domainname.xyz/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/blog.domainname.xyz/privkey.pem
This certificate expires on 2026-11-28.
These files will be updated when the certificate renews.

Deploying certificate
Successfully deployed certificate for blog.domainname.xyz to /etc/nginx/sites-enabled/blog.conf
Congratulations! You have successfully enabled HTTPS on https://blog.domainname.xyz

NEXT STEPS:
- The certificate will need to be renewed before it expires. Certbot can automatically renew the certificate in the background, but you may need to take steps to enable that functionality. See https://certbot.org/renewal-setup for instructions.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
