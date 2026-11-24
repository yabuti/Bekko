# Bekko Coffee

A Laravel application with a React frontend (Inertia.js) for table QR ordering.

Customers scan the QR code on their table, order from their phone, and the order appears instantly on the waiter and kitchen dashboards. Those dashboards refresh every 5 seconds.

## Project structure

The project lives directly in this folder — there is no `website/` wrapper.

- `app/` — Laravel models, controllers, middleware, requests and seeders
- `routes/web.php` — all customer and staff routes
- `database/` — SQLite database, migrations and seeders
- `resources/js/Pages/` — React/Inertia pages
- `resources/js/Components/` — shared React components
- `resources/css/` — site styles
- `public/images/` — menu photos and hero image
- `public/logo.webp` — cafe logo

## Setup

```powershell
composer install
cp .env.example .env
php artisan key:generate

# SQLite database file
New-Item -ItemType File database/database.sqlite -Force

php artisan migrate --seed

cmd /c "npm install"
cmd /c "npm run build"
php artisan serve
```

Open `http://127.0.0.1:8000`.

> On Windows, use `cmd /c "npm ..."` because `npm.ps1` is blocked by the PowerShell execution policy.

## Demo staff accounts

After seeding, sign in at `/staff/login`:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@bekkocoffee.test` | `password` |
| Waiter | `waiter@bekkocoffee.test` | `password` |
| Kitchen | `kitchen@bekkocoffee.test` | `password` |

Change these passwords before using the app in a real cafe.

## How the ordering flow works

1. Each table has a unique code (`T1`–`T10`) and a QR code pointing to `/t/T1`.
2. A customer scans the code, picks items from the menu, and taps **Place order**.
3. The order is saved to the database and the customer gets a tracking page at `/orders/{token}`.
4. The kitchen dashboard shows the new ticket. Staff move it through **Start preparing → Mark ready**.
5. The waiter dashboard shows ready orders and staff tap **Mark as served**.
6. Both dashboards reload new order data every 5 seconds. The customer's tracking page does the same.

## Useful routes

| URL | Purpose |
| --- | --- |
| `/` | Public homepage |
| `/menu` | Full public menu (also printable) |
| `/t/T1` | Customer menu for Table 1 (change the code for other tables) |
| `/orders/{token}` | Customer order tracking link |
| `/staff/login` | Staff sign-in |
| `/staff/waiter` | Waiter dashboard |
| `/staff/kitchen` | Kitchen dashboard |
| `/staff/tables` | Printable QR codes for all tables |
| `/staff/menu` | Admin menu manager (admins only) |

## Managing the menu

Sign in as the admin and open `/staff/menu` (admins are sent there after login). From there you can:

- add a new meal with a name, category, group heading, price and display order
- edit an existing meal's name, price, group or category
- write a full description and an ingredient list (separate ingredients with commas or new lines)
- upload, replace or remove a meal photo (JPG, PNG or WebP, up to 2 MB)

Photos are stored in `public/menu-photos/` and appear straight away on `/menu` and on the customer QR menu. Deleting a meal keeps it out of both menus while preserving old order lines.

Clicking a meal on `/menu` opens a detail view with its photo, full description, ingredients and price. On `/t/{code}` the same detail view includes an **Add to order** button, so customers can read about a dish before ordering it.

> Reseeding with `MenuItemSeeder` restores prices and photos from `menu.json`, which will overwrite changes made in the admin page. Descriptions and ingredients are not in `menu.json`, so they are left alone by reseeding. Do not reseed after editing the menu in the admin page.

## Editing content

- `resources/js/data/menu.json` — the 142 menu items and prices (shared by React and the seeder)
- `config/site.php` — cafe name, hours, address, phone, email, Instagram and currency
- `public/{breakfast,lunch,drink}/` — real menu photos, mapped by name in `resources/js/data/menuPhotos.json`
- `resources/js/i18n/{en,am,or}/` — one folder per language, with one file per page (English, Amharic, Afaan Oromoo)
- `public/images/*.svg` — fallback thumbnails used when a menu item has no photo
- `public/menu-photos/` — photos uploaded in the admin page (gitignored)

After changing menu prices or items, re-run:

```powershell
php artisan db:seed --class=MenuItemSeeder
```

## Commands

```powershell
php artisan migrate --seed   # reset and seed the database
cmd /c "npm run dev"         # Vite dev server (optional)
cmd /c "npm run build"       # production assets
php artisan test             # Laravel tests
```

## Git

```powershell
git add .
git commit -m "Laravel ordering system"
git push
```
