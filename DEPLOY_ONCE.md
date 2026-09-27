# One-time production deployment

This repository produces two deployment payloads with different destinations:

- `site/` is the built Vue application for `https://fancivoid.asia/`.
- `server/api/weather.php` is the PHP endpoint for `https://fancivoid.asia/api/weather.php`.

The WordPress site at `https://www.fancivoid.asia/` is separate. Do not replace,
move, or upload files into the WordPress document root.

## Before upload

1. Rotate the previously exposed WeatherAPI key in the provider console.
2. Configure the replacement as the server-only environment variable
   `WEATHERAPI_KEY` for the root-domain PHP runtime. Never use a `VITE_` prefix.
3. Back up the current root-domain static files and server routing configuration.
4. Confirm the host routes `/api/weather.php` to PHP and does not rewrite
   `/api/*` to `index.html`.

## Single upload

1. Upload the contents of `site/` together to the root-domain web directory.
   Replace the previous `index.html`, hashed assets, manifest, and service worker
   as one atomic release where the host supports it.
2. Upload `server/api/weather.php` as `/api/weather.php` on the same root domain.
3. Do not upload this archive, `.env`, source files, or any real credential.
4. Remove any public diagnostic file such as `test.php` from the root-domain host.

## Production acceptance

Use a fresh browser profile after the upload:

1. Open `https://fancivoid.asia/` at desktop width and at 390×844, 430×932,
   and 508×880. Confirm the desktop two-column view, mobile capsule/tag/default
   panel navigation, close behavior, and footer placement.
2. Confirm the Blog CTA is exactly `https://www.fancivoid.asia`.
3. In DevTools Network, confirm the browser requests only
   `/api/weather.php` for weather and never contacts a third-party weather or
   IP-geolocation endpoint directly.
4. Confirm `GET /api/weather.php` returns normalized JSON and a non-GET request
   returns HTTP 405. Responses must not contain provider diagnostics or keys.
5. In Application > Service Workers, update/reload the worker, then verify an
   `/api/*` navigation is not served by the SPA shell or an old runtime cache.
6. Confirm the background loads from `/images/background1.webp`, article links
   stay on HTTPS `www.fancivoid.asia`, and no source map is publicly available.

If any check fails, restore the root-domain backup. WordPress requires no rollback
because this release must not modify it.
