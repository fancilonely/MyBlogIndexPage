English | [Chinese](./README.md)

# FanciVoid Homepage

This repository contains the source code for the FanciVoid root-domain landing page.

Production domain:

[https://fancivoid.asia](https://fancivoid.asia)

Main website entry:

[https://www.fancivoid.asia](https://www.fancivoid.asia)

This page is designed as a static portal for projects, notes, and creative experiments.

## Project Purpose

This project is a customized personal landing portal based on the open-source homepage template `imsyy/home`. It is used as the root-domain entry page for FanciVoid and focuses on:

- FanciVoid branding
- Portal-style navigation
- Anime-inspired glassmorphism visual style
- Static deployment (no backend)
- Entry link to [www.fancivoid.asia](https://www.fancivoid.asia)

## Local Development

Install dependencies (uses pnpm; npm also works if you prefer):

pnpm install

Run dev server:

pnpm dev

The project scripts (from `package.json`) are:

- `dev`: start Vite dev server
- `build`: build production files
- `preview`: preview the built site

## Build

Build the production output:

pnpm build

The build output is generated in the `dist/` directory.

## Deployment

- Run the build command first (`pnpm build`).
- Upload only the *contents* of the `dist/` folder to the server directory used by `fancivoid.asia`, for example `fancivoid-home/`.
- Do NOT upload the whole source project to the web server.
- Do NOT upload `node_modules`, `src`, `package.json`, `vite.config.js`, or other source files to the production web directory.
- Keep the existing `www.fancivoid.asia` site in its own directory (for example `/wwwroot/`). The root domain `fancivoid.asia` should point to the separate homepage directory such as `/fancivoid-home/`.

Example server structure:

```
/wwwroot/      -> existing www.fancivoid.asia site
/fancivoid-home/ -> built FanciVoid root-domain homepage (contents of `dist/`)
```

## Background Replacement

The homepage uses a single local background image.

Expected background file name: `background1.jpg`

Place `background1.jpg` at:

`public/images/background1.jpg`

To replace the homepage background, replace `background1.jpg` with another image using the same filename.

## Music Configuration

- The music player is preserved in the UI.
- Music is paused by default; there is no autoplay.
- Music and playlist configuration is controlled via environment variables and the API helper: see `.env` and `src/api/index.js` for `VITE_SONG_API`, `VITE_SONG_SERVER`, `VITE_SONG_TYPE`, and `VITE_SONG_ID`.
- Player autoplay control is set in `src/store/index.js` (`playerAutoplay` defaults to `false`).

Do not hardcode an invalid API endpoint; configure a valid music API if you enable remote playlists.

## Link Configuration

Current portal links configured in `src/assets/siteLinks.json`:

- Main Site / Void Gate: [https://www.fancivoid.asia](https://www.fancivoid.asia)
- GitHub: [https://github.com/fancilonely](https://github.com/fancilonely)
- Projects: placeholder (coming soon)
- Notes: placeholder (coming soon)
- Contact: mailto:haotianzhu1115@foxmail.com

Projects and Notes are placeholders — the actual pages are not implemented yet.

## Original Template Attribution

This project is based on the open-source personal homepage template `imsyy/home`.

Original project:

[https://github.com/imsyy/home](https://github.com/imsyy/home)

The original project is licensed under the MIT License.

This repository modifies the original template for the FanciVoid / fancilonely personal landing page, including branding, layout, background usage, portal links, weather/hitokoto removal, mobile layout adjustments, SEO metadata, and deployment documentation.

## Original Template Notes

The remainder of this README is kept from the original template for reference. It is presented here as original-template-only documentation and should not be taken as the main instructions for the FanciVoid customization.

--- ORIGINAL TEMPLATE START ---

... (original README content retained for reference)

--- ORIGINAL TEMPLATE END ---

## License

The original project is licensed under the MIT License. This repository retains the original license file and attribution.

- Compress the font again

```
. /woff2_compress . /font_name.ttf
```

- Eventually the original font can be slow loaded, **load the compressed font first**

>For more information, please go to [虹墨空间站](https://www.imaegoo.com/2020/chinese-font-compress/) to view the original article

</details>

### Technology Stack

* [Vue](https://cn.vuejs.org/)
* [Vite](https://vitejs.cn/vite3-cn/)
* [Pinia](https://pinia.vuejs.org/zh/)
* [IconPark](https://iconpark.oceanengine.com/official)
* [xicons](https://xicons.org/)
* [Aplayer](https://aplayer.js.org/)

### API

* [韩小韩 WebAPI 接口](https://api.vvhan.com/)
* [搏天 API](https://api.btstu.cn/doc/sjbz.php)
* [高德开放平台](https://lbs.amap.com/)
* [Hitokoto 一言](https://hitokoto.cn/)

<a title="SSL" target="_blank" href="https://myssl.com/seal/detail?domain=blog.imsyy.top"><img src="https://img.shields.io/badge/MySSL-安全认证-brightgreen"></a>&nbsp;<a title="CDN" target="_blank" href="https://cdnjs.com/"><img src="https://img.shields.io/badge/CDN-Cloudflare-blue"></a>&nbsp;<a title="Copyright" target="_blank" href="https://imsyy.top/"><img src="https://img.shields.io/badge/Copyright%20%C2%A9%202020--2023-%E7%84%A1%E5%90%8D-red"></a>
