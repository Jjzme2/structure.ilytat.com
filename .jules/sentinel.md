## 2024-06-22 - Missing Email Verification Check in Auth
**Vulnerability:** Admin access could be granted to unverified Firebase accounts with a hardcoded admin email.
**Learning:** Firebase allows creating unverified accounts with any email. Relying solely on `user.email` in the decoded token without checking `user.email_verified` can lead to account takeover or auth bypass.
**Prevention:** Always verify `user.email_verified === true` when authorizing based on custom or hardcoded email lists from decoded tokens.
## 2024-06-22 - Missing Email Verification Check in Auth
**Vulnerability:** Admin access could be granted to unverified Firebase accounts with a hardcoded admin email.
**Learning:** Firebase allows creating unverified accounts with any email. Relying solely on `user.email` in the decoded token without checking `user.email_verified` can lead to account takeover or auth bypass.
**Prevention:** Always verify `user.email_verified === true` when authorizing based on custom or hardcoded email lists from decoded tokens.
