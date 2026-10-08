# Zwart Studio

Official website source for https://zwart.my.id.

Deployment: Cloudflare Pages, production branch `main`, build command `exit 0`, output directory `public`.

The website's public GitHub catalog is sourced from the Zwart04 account.

## Deployment notes

Pushes to `main` trigger Cloudflare Pages only while the Cloudflare GitHub integration is connected. Check **Workers & Pages → zwart-website → Deployments** for a successful production deployment. If Cloudflare reports `This project is disconnected from your Git account`, reconnect the Cloudflare Pages GitHub app to this repository before retrying.
