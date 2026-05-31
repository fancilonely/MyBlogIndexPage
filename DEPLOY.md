# Deployment

This project is a static Vite site.

## Build

Run:

```bash
npm run build
```

## Upload

Upload the contents of the generated `dist` folder to the server directory used by `fancivoid.asia`.

The homepage background is fixed to `public/images/background1.jpg`. Replace this file with another image using the same filename.

For example:

- `dist/*` -> `fancivoid-home/`

Do not upload the whole source project directory. Only deploy the compiled files from `dist`.
