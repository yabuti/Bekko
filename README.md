# Bekko Coffee

A React + Vite website for the cafe, with a separate menu page, digital QR menu and a printable menu.

## What's inside

- **Homepage** — hero, highlights, our story, and find-us sections
- **Menu page** (`/#menu`) — photo cards grouped by Breakfast, Lunch, Bites, Drinks and Fresh Drinks
- **Print menu** — an A4-friendly version with logo and QR code
- **QR code** — points to `/#menu`, so it keeps working wherever the site is hosted

## Run locally

```bash
cd website
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Edit the content

- `website/src/data/site.js` — cafe name, tagline, hours, address, contact details, currency
- `website/src/data/menu.js` — menu categories, item names and prices
- `website/src/data/menuImages.js` — maps items to thumbnail files
- `website/public/images/` — menu thumbnails and the logo (`logo.webp`)

Replace any file in `website/public/images/` with a real photo using the same filename and the site updates automatically.

## Commands

```bash
npm run dev      # start the dev server
npm run build    # production build into website/dist
npm run lint     # check the code
```

## Deploy

`npm run build` produces a static site in `website/dist` that can be hosted for free on Netlify, Vercel or GitHub Pages.
