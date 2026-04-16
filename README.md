<div align="center">

<h1>Japanese Mahjong Font with OpenType</h1>
<h3>OpenType 機能付き麻雀牌図フォント</h3>

![pnpm](https://img.shields.io/badge/pnpm-v10-F69220?style=flat-square&logo=pnpm&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-v22.17.0-339933?style=flat-square&logo=nodedotjs&logoColor=white)
[![License: SIL](https://img.shields.io/badge/License-SIL_1.1-yellow.svg)](https://openfontlicense.org/)

![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Tanstack](https://img.shields.io/badge/Tanstack-1.168.22-black?style=flat-square&logo=tanstack)

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38bdf8?style=flat-square&logo=tailwind-css)
![ShadCN](https://img.shields.io/badge/shadcn%2Fui-2.4.0-000000?style=flat-square&logo=shadcnui&logoColor=white)

Host on ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?logo=cloudflarepages&logoColor=fff&style=flat-square)

🔗&nbsp;&nbsp;Playground: https://mahjongfont.pages.dev/ &nbsp;&nbsp;🔗

![](/assets/banner.png)

[[Notation (en)]](#Notation) ・ [[表記法 (ja)]](#表記法) ・ [[表記方式 (zh)]](#表記方式)

</div>

## Notation

1. Man（**M**anzu）：`1m`~`9m`
2. Pin（**P**inzu）：`1p`~`9p`
3. Sou（**S**ouzu）：`1s`~`9s`
4. Zi（**Z**ihai）：`1z`~`9z` (Sorted by Fonpai - Sangenpai)
   - `1z`：Higashi, East
   - `2z`：Minami, South
   - `3z`：Nishi, West
   - `4z`：Kita, North
   - `5z`：Haku, Shiro
   - `6z`：Hatsu
   - `7z`：Chun, Naka
5. Dice: `1.`~`6.`
6. Aka-Dora：Follow by a asterisk (`*`). E.g., `5p*`, `5s*`, `5m*` .
7. Fuuro：Follow by a minus sign (`-`). E.g., `3m3m3m-`, `4s5s-6s`.
   - Chi：`4s4s-4s`
   - Pon：`3m3m3m-`
   - Dai-Minkan：`6m6m6m-6m`
8. Ka-Kan：Follow by an equal mark (`=`). E.g., `3m3m3m-3m=`, `6m`.
9. An-Kan：Use `0p`, `0s`, `0m`, `0z` to show the reversed one.

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
   - 吃（チー）：`4s4s-4s`
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
   - 吃：`4s4s-4s`
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
pnpm run format
pnpm run lint
pnpm build
```

## Font Download

See [Releases](https://github.com/rutopio/Japanese-Mahjong-Font-with-OpenType/releases).

## License

This Font Software is licensed under the SIL Open Font License, Version 1.1.

See [License](https://github.com/rutopio/Japanese-Mahjong-Font-with-OpenType?tab=License-1-ov-file#readme).

## Special Thanks

- [I.Mahjong - @SyaoranHinata](https://github.com/SyaoranHinata/I.Mahjong/tree/main)
- [Gutenberg Labo](http://gutenberg.osdn.jp)
- [Inconsolata - Google Fonts](https://fonts.google.com/specimen/Inconsolata)
