import { useTranslation } from "react-i18next";
import localFont from "next/font/local";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transformString } from "@/lib/transform-string";

const examples = [
  {
    combination: "manzu-examples",
    notation: "1m2m3m",
  },
  {
    combination: "pinzu-aka-dora-examples",
    notation: "4p5p*6p",
  },
  {
    combination: "souzu-fuuro-examples",
    notation: "6s7s-8s",
  },
  {
    combination: "zipai-ka-kan-examples",
    notation: "1z1z1z-1z=",
  },
  {
    combination: "zipai-an-kan-examples",
    notation: "0z7z7z0z",
  },
  {
    combination: "big-gap-examples",
    notation: "1m2m3m5s5s*_5s",
  },
];

export default function Notations({ theme }: { theme: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        {/* 桌面版表格 */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tileName")}</TableHead>
                <TableHead>{t("notation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">{t("manzu")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    1m
                  </Badge>{" "}
                  ~{" "}
                  <Badge variant="outline" className="rounded-full">
                    9m
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("pinzu")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    1p
                  </Badge>{" "}
                  ~{" "}
                  <Badge variant="outline" className="rounded-full">
                    9p
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("souzu")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    1s
                  </Badge>{" "}
                  ~{" "}
                  <Badge variant="outline" className="rounded-full">
                    9s
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("zipai")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    1z
                  </Badge>{" "}
                  ~{" "}
                  <Badge variant="outline" className="rounded-full">
                    7z
                  </Badge>
                  （東南西北白発中）
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("aka-dora")}</TableCell>
                <TableCell className="break-words">
                  {t("explainOfAkaDora")}{" "}
                  <Badge variant="outline" className="rounded-full">
                    5m*
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    5p*
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    5s*
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("fuuro")}</TableCell>
                <TableCell>
                  {t("explainOfFuuro")}{" "}
                  <Badge variant="outline" className="rounded-full">
                    4m-
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    6s-
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    7z-
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("ka-kan")}</TableCell>
                <TableCell>
                  {t("explainOfKaKan")}{" "}
                  <Badge variant="outline" className="rounded-full">
                    2m=
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    5s=
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    1z=
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("an-kan")}</TableCell>
                <TableCell>
                  {t("explainOfAnKan1")}{" "}
                  <Badge variant="outline" className="rounded-full">
                    0m
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    0p
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    0s
                  </Badge>{" "}
                  <Badge variant="outline" className="rounded-full">
                    0z
                  </Badge>{" "}
                  {t("explainOfAnKan2")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("space")}</TableCell>
                <TableCell>
                  {t("explainOfSpace")}
                  <Badge variant="outline" className="rounded-full">
                    _
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">{t("big-gap")}</TableCell>
                <TableCell>
                  {t("explainOfBigGap")}
                  <Badge variant="outline" className="rounded-full">
                    _
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 手機版卡片式布局 */}
        <div className="block space-y-3 p-4 sm:hidden">
          <div className="space-y-2">
            <div className="text-sm font-bold">{t("manzu")}</div>
            <div className="text-sm">
              <Badge variant="outline" className="rounded-full">
                1m
              </Badge>{" "}
              ~{" "}
              <Badge variant="outline" className="rounded-full">
                9m
              </Badge>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("pinzu")}</div>
            <div className="text-sm">
              <Badge variant="outline" className="rounded-full">
                1p
              </Badge>{" "}
              ~{" "}
              <Badge variant="outline" className="rounded-full">
                9p
              </Badge>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("souzu")}</div>
            <div className="text-sm">
              <Badge variant="outline" className="rounded-full">
                1s
              </Badge>{" "}
              ~{" "}
              <Badge variant="outline" className="rounded-full">
                9s
              </Badge>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("zipai")}</div>
            <div className="text-sm">
              <Badge variant="outline" className="rounded-full">
                1z
              </Badge>{" "}
              ~{" "}
              <Badge variant="outline" className="rounded-full">
                7z
              </Badge>
              （東南西北白発中）
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("aka-dora")}</div>
            <div className="text-sm break-words">
              <div className="mb-2">{t("explainOfAkaDora")}</div>
              <div>
                <Badge variant="outline" className="rounded-full">
                  5m*
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  5p*
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  5s*
                </Badge>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("fuuro")}</div>
            <div className="text-sm">
              <div className="mb-2">{t("explainOfFuuro")}</div>
              <div>
                <Badge variant="outline" className="rounded-full">
                  4m-
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  6s-
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  7z-
                </Badge>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("ka-kan")}</div>
            <div className="text-sm">
              <div className="mb-2">{t("explainOfKaKan")}</div>
              <div>
                <Badge variant="outline" className="rounded-full">
                  2m=
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  5s=
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  1z=
                </Badge>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("an-kan")}</div>
            <div className="text-sm">
              <div className="mb-2">
                {t("explainOfAnKan1")}{" "}
                <Badge variant="outline" className="rounded-full">
                  0m
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  0p
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  0s
                </Badge>{" "}
                <Badge variant="outline" className="rounded-full">
                  0z
                </Badge>{" "}
                {t("explainOfAnKan2")}
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("space")}</div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="rounded-full">
                _
              </Badge>
              {t("explainOfSpace")}
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <div className="text-sm font-bold">{t("big-gap")}</div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="rounded-full">
                _
              </Badge>
              {t("explainOfBigGap")}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        {examples.map((example, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 border-b p-2 sm:flex-row sm:justify-between sm:space-y-0"
          >
            {/* 第一行：組合名稱和記號 */}
            <div className="flex flex-col p-2 sm:flex-1">
              <div className="text-sm font-bold break-words">
                {t(example.combination)}
              </div>
              <div className="font-mono text-sm break-all">
                {example.notation}
              </div>
            </div>

            {/* 第二行：置中的麻將字型顯示 */}
            <div className="flex items-center justify-center p-2 sm:justify-end sm:pt-10 sm:pr-2">
              <div
                className={`text-4xl sm:text-7xl ${
                  theme === "monochrome"
                    ? "font-riichi-mahjong-mono"
                    : "font-riichi-mahjong-color"
                }`}
              >
                {transformString(example.notation)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
