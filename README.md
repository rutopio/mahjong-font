<div align="center">

<h2>Mahjong Font / Mahjong Tile Image Generator</h2>
<h3>OpenType 機能付き麻雀牌図フォント / 麻雀牌図作成ツール</h3>

🔗&nbsp;&nbsp;Playground: https://mahjong.chingru.com/ &nbsp;&nbsp;🔗

![pnpm](https://img.shields.io/badge/pnpm-v11-F69220?style=flat-square&logo=pnpm&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-v24-339933?style=flat-square&logo=nodedotjs&logoColor=white)
[![License: OFL 1.1 (Font) / MIT (Code)](https://img.shields.io/badge/License-OFL_1.1_(Font)_/_MIT_(Code)-yellow.svg)](./LICENSE-FONT)

![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Tanstack](https://img.shields.io/badge/Tanstack-1-black?style=flat-square&logo=tanstack)

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwind-css)
![ShadCN](https://img.shields.io/badge/shadcn%2Fui-4-000000?style=flat-square&logo=shadcnui&logoColor=white)

Hosted on ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?logo=cloudflarepages&logoColor=fff&style=flat-square)


![](/assets/banner.png)

[[Notation (en)]](#Notation) ・ [[表記法 (ja)]](#表記法) ・ [[表記方式 (zh)]](#表記方式)


</div>

## Notation

1. Man (**M**anzu): `1m` to `9m`
2. Pin (**P**inzu): `1p` to `9p`
3. Sou (**S**ouzu): `1s` to `9s`
4. Zi (**Z**ihai): `1z` to `7z` (winds, then dragons)
   - `1z`: East (Higashi)
   - `2z`: South (Minami)
   - `3z`: West (Nishi)
   - `4z`: North (Kita)
   - `5z`: White (Haku)
   - `6z`: Green (Hatsu)
   - `7z`: Red (Chun)
5. Dice: `1.` to `6.`
6. Aka-dora (red five): add an asterisk (`*`) after the tile, for example `5p*`, `5s*`, `5m*`.
7. Fuuro (open meld): add a minus sign (`-`) after the called tile, for example `3m3m3m-`, `4s5s-6s`.
   - Chi (sequence): `4s5s-6s`
   - Pon (triplet): `3m3m3m-`
   - Dai-minkan (open quad): `6m6m6m-6m`
8. Ka-kan (added quad): add an equals sign (`=`) after the added tile, for example `3m3m3m-3m=`.
9. An-kan (closed quad): use `0p`, `0s`, `0m`, `0z` for the face-down tiles.

## 表記法

1. 萬子（マンズ）：`1m`~`9m`
2. 筒子（ピンズ）：`1p`~`9p`
3. 索子（ソーズ）：`1s`~`9s`
4. 字牌（ジハイ）：`1z`~`9z`（風牌 - 三元牌順）
   - `1z`：東
   - `2z`：南
   - `3z`：西
   - `4z`：北
   - `5z`：白
   - `6z`：発
   - `7z`：中
5. サイコロ：`1.`~`6.`
6. 赤ドラ：後ろに星マーク（`*`）を付ける。例：`5p*`, `5s*`, `5m*` .
7. 副露（フーロ）：後ろにマイナスマーク（`-`）を付ける。例：
   - 吃（チー）：`4s5s-6s`
   - 碰（ポン）：`3m3m3m-`
   - 大明槓（ダイミンカン）：`6m6m6m-6m`
8. 加槓（カカン）：後ろにイコールマーク（`=`）を付ける。例：`3m3m3m-3m=`.
9. 暗槓（アンカン）：`0p`, `0s`, `0m`, `0z` 牌を裏返し表記。

## 表記方式

1. 萬子：`1m`~`9m`
2. 筒子：`1p`~`9p`
3. 索子：`1s`~`9s`
4. 字牌：`1z`~`9z`（按照風牌 - 三元牌順）
   - `1z`：東
   - `2z`：南
   - `3z`：西
   - `4z`：北
   - `5z`：白
   - `6z`：発
   - `7z`：中
5. 骰子：`1.`~`6.`
6. 赤寶牌：在表記牌的後面加上星號（`*`）。例：`5p*`, `5s*`, `5m*` .
7. 副露：在表記牌的後面加上減號（`-`）。例：
   - 吃：`4s5s-6s`
   - 碰：`3m3m3m-`
   - 大明槓：`6m6m6m-6m`
8. 加槓：在表記牌的後面加上等號（`=`）。例：`3m3m3m-3m=`.
9. 暗槓：使用 `0p`, `0s`, `0m`, `0z` 表示翻過來的牌。

## Develop & Build

- Develop

```
pnpm install
pnpm dev
```

- Build

```
pnpm check
pnpm build
```

## Preprocess

The app renders tiles as inline SVG (not as a webfont), which fixes iOS
download blanks and gives consistent cross-browser COLR/CPAL color support.
The glyph data is extracted ahead of time from the Riichi-Mahjong woff2 fonts
into `src/lib/tiles-data.json`, which the web app and the Image API both read.

- Tile glyph data — extract ligatures, SVG paths, bounds and the COLR/CPAL
  palette from `preprocess/fonts/*.woff2` into `src/lib/tiles-data.json`.
  Requires Python with [fontTools](https://github.com/fonttools/fonttools).
  Re-run after changing the source fonts:

  ```
  pip install fonttools
  python3 preprocess/extract-tiles.py
  ```

- Web fonts — UI fonts are self-hosted via `@fontsource` packages, imported
  directly in `src/styles/fonts.css` (Vite bundles and hashes the woff2). Paper
  Mono (not on @fontsource) stays as a local `public/fonts/` woff2.

## Image API

Add a tile string to the URL path to get an inline SVG image you can embed
anywhere, shields.io-style. The tile path is required (up to 512 characters).
Theme and color fall back to their defaults when omitted.

```
https://mahjong.chingru.com/img/<tile>?theme=color&color=AA7942
```

| Parameter | Location | Type            | Default  | Description                                                                  |
| --------- | -------- | --------------- | -------- | ---------------------------------------------------------------------------- |
| `tile`    | path     | `string`        | required | Tile string (same [notation](#Notation)). `_` for a gap, for example `123m456p_5z`. |
| `theme`   | query    | `color \| mono` | `color`  | `color` for colorful tiles, `mono` for monochrome.                                  |
| `color`   | query    | `string` (hex)  | `AA7942` | Main tile color, six-digit hex without `#`. Only applies when `theme=color`.        |

The SVG is rendered at a fixed height of 500px; width scales proportionally.

It is a vector, so you can resize it freely when embedding. For example:

```md
![Mahjong tile diagram: 7m7m7m2p3p4p8p8p8p4s5s6s8s_8s](https://mahjong.chingru.com/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s)
```

![Mahjong tile diagram: 7m7m7m2p3p4p8p8p8p4s5s6s8s_8s](https://mahjong.chingru.com/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s)



Tip: take any share URL from the app and swap `?tile=` for the `/img/` path to
get the matching image. Full docs and live examples: https://mahjong.chingru.com/api

## Site Files

Static files served from `public/` for crawlers and agents:

- [`robots.txt`](public/robots.txt) — allows all crawlers, points to the sitemap.
- [`sitemap.xml`](public/sitemap.xml) — lists the page routes across all locales, with hreflang alternates.
- [`llms.txt`](public/llms.txt) — project and Image API overview for LLMs,
  following the [llms.txt](https://llmstxt.org/) convention.

## Font Download

See [Releases](https://github.com/rutopio/mahjong-font/releases).

## License

The source code is licensed under the [MIT License](./LICENSE).

The font files are licensed under the [SIL Open Font License, Version 1.1](./LICENSE-FONT).

## Special Thanks

- [I.Mahjong - @SyaoranHinata](https://github.com/SyaoranHinata/I.Mahjong/tree/main)
- [Gutenberg Labo](http://gutenberg.osdn.jp)
- [Inconsolata - Google Fonts](https://fonts.google.com/specimen/Inconsolata)
- [Riichi.Wiki](https://riichi.wiki/)
