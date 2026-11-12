# Zwart Studio

Official website source for https://zwart.my.id.

Deployment: Cloudflare Pages, production branch `main`, build command `exit 0`, output directory `public`.

The site is a static portfolio. No repository listing is rendered; project links point to the GitHub profile only.

## Deployment notes

Pushes to `main` trigger Cloudflare Pages only while the Cloudflare GitHub integration is connected. Check **Workers & Pages → zwart-website → Deployments** for a successful production deployment. If Cloudflare reports `This project is disconnected from your Git account`, reconnect the Cloudflare Pages GitHub app to this repository before retrying.
