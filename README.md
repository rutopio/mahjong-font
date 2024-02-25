<div align="center">

<h1>Japanese Mahjong Font with OpenType</h1>
<h3>OpenType 機能付き麻雀牌図フォント</h3>

🔗&nbsp;&nbsp; https://mahjongfont.pages.dev/ &nbsp;&nbsp;🔗

![](src/assets/banner.png)

[[Notation (en)]](#Notation) ・ [[表記法 (ja)]](#表記法)  ・ [[表記方式 (zh)]](#表記方式)

</div>




## Notation

1. Man（**M**anzu）：`1m`~`9m`
2. Pin（**P**inzu）：`1p`~`9p`
3. Sou（**S**ouzu）：`1s`~`9s`
4. Zi（**Z**ihai）：`1z`~`9z` (Sorted by Fonpai - Sangenpai）
   - `1z`：Higashi, East
   - `2z`：Minami, South
   - `3z`：Nishi, West
   - `4z`：Kita, North
   - `5z`：Haku, Shiro
   - `6z`：Hatsu
   - `7z`：Chun, Naka
5. Aka-Dora：Follow by a star mark (`*`). E.g., `5p*`, `5s*`, `5m*` .
6. Fuuro：Follow by a minus mark (`-`). E.g., `3m3m3m-`, `4s5s-6s`.
    - Chi：`4s4s-4s`
	- Pon：`3m3m3m-`
	- Dai-Minkan：`6m6m6m-6m`
7. Ka-Kan：Follow by an equal mark (`=`). E.g., `3m3m3m-3m=`, `6m`.
8. An-Kan：Use `0p`, `0s`, `0m`, `0z` to show the reversed one.

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
5. 赤ドラ：後ろに星印（`*`）を付ける。例：`5p*`, `5s*`, `5m*` .
6. 副露（フーロ）：後ろにマイナス記号（`-`）を付ける。例：
	- 吃（チー）：`4s4s-4s`
	- 碰（ポン）：`3m3m3m-`
	- 大明槓（ダイミンカン）：`6m6m6m-6m`
7. 加槓（カカン）：後ろに等号（`=`）を付ける。例：`3m3m3m-3m=`.
8. 暗槓（アンカン）：`0p`, `0s`, `0m`, `0z` 牌を裏返し表記。

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
5. 赤寶牌：在表記牌的後面加上星號（`*`）。例：`5p*`, `5s*`, `5m*` .
6. 副露：在表記牌的後面加上減號（`-`）。例：
	- 吃：`4s4s-4s`
	- 碰：`3m3m3m-`
	- 大明槓：`6m6m6m-6m`
7. 加槓：在表記牌的後面加上等號（`=`）。例：`3m3m3m-3m=`.
8.  暗槓：使用 `0p`, `0s`, `0m`, `0z` 表示翻過來的牌。


## OpenType Features

### Ligature (*liga*)

| Software | Support? | Note |
|:---|:---:|:---|
| Adobe Series | ✅ | |
| iWork (Pages, Numbers, Keynote)|✅|| 

## Web Tool

### Develop & Build

- Develop

```
npm install
npx parcel src/index.html
```

- Build

```
npx parcel build src/index.html
```

## Special Thanks

- [I.Mahjong - @SyaoranHinata](https://github.com/SyaoranHinata/I.Mahjong/tree/main)
- [Gutenberg Labo](http://gutenberg.osdn.jp)
- [Chivo Mono - Google Fonts](https://fonts.google.com/specimen/Chivo+Mono)

## License

This Font Software is licensed under the SIL Open Font License, Version 1.1. 

The license is available with a FAQ at: [https\://openfontlicense.org](https://openfontlicense.org/open-font-license-official-text/)