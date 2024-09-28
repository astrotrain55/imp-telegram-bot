# ImpBot

ImpBot based on Node.js and [Telegraf](https://github.com/telegraf/telegraf) framework.

## Before you start

First copy `.env.example` file to `.env` and fill in all necessary values.

```
TELEGRAM_BOT_TOKEN="<YOUR_BOT_API_TOKEN>"
```

## Start your local server

```
npm ci
npm run dev
```

## Production

You can fork this template and do the necessary changes you need. Then you when are done with your changes simply goto [vercel git import](https://vercel.com/import/git).

Reference to [this update](https://vercel.com/docs/security/deployment-protection#migrating-to-standard-protection), you need turn off `Vercel Authentication`, Settings => Deployment Protection
