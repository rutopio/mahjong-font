import { useTranslation } from "react-i18next";

import { TileSvg } from "@/components/mahjong/tile-svg";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NotationItem } from "@/lib/constants";
import { notationExamples, notationItems } from "@/lib/constants";
import { transformString } from "@/lib/transform-string";

function NotationBadge({ children }: { children: React.ReactNode }) {
  return <Badge variant="outline">{children}</Badge>;
}

function NotationContent({
  item,
  t,
}: {
  item: NotationItem;
  t: (key: string) => string;
}) {
  switch (item.type) {
    case "range":
      return (
        <>
          <NotationBadge>{item.start}</NotationBadge> ~{" "}
          <NotationBadge>{item.end}</NotationBadge>
          {item.suffix}
        </>
      );
    case "badges":
      return (
        <>
          {t(item.descriptionKey)}{" "}
          {item.badges.map((badge) => (
            <span key={badge}>
              <NotationBadge>{badge}</NotationBadge>{" "}
            </span>
          ))}
        </>
      );
    case "badges-wrapped":
      return (
        <>
          {t(item.descriptionKey1)}{" "}
          {item.badges.map((badge) => (
            <span key={badge}>
              <NotationBadge>{badge}</NotationBadge>{" "}
            </span>
          ))}
          {t(item.descriptionKey2)}
        </>
      );
    case "description":
      return <>{t(item.descriptionKey)}</>;
  }
}

export function Notations({ theme }: { theme: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("notation.tileName")}</TableHead>
                <TableHead>{t("notation.notation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notationItems.map((item) => (
                <TableRow key={item.titleKey}>
                  <TableCell className="font-medium">
                    {t(item.titleKey)}
                  </TableCell>
                  <TableCell
                    className={
                      item.titleKey === "notation.aka-dora"
                        ? "wrap-break-word"
                        : ""
                    }
                  >
                    <NotationContent item={item} t={t} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="block space-y-3 p-4 sm:hidden">
          {notationItems.map((item, index) => (
            <div key={item.titleKey}>
              {index > 0 && <hr className="mb-3 border-border" />}
              <div className="space-y-2">
                <div className="text-pretty font-medium text-sm">
                  {t(item.titleKey)}
                </div>
                <div
                  className={`text-pretty text-sm ${item.titleKey === "notation.aka-dora" ? "break-words" : ""}`}
                >
                  <NotationContent item={item} t={t} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-md border">
        {notationExamples.map((example, index) => (
          <div
            key={example.notation}
            className={`flex flex-col p-2 ${index < notationExamples.length - 1 ? "border-b" : ""} ${index === 3 ? "gap-8" : "gap-4"}`}
          >
            <div className="flex items-center gap-4 p-2">
              <div className="wrap-break-word font-medium text-sm">
                {t(example.combination)}
              </div>
              <Badge variant="outline">{example.notation}</Badge>
            </div>

            <TileSvg
              text={transformString(example.notation)}
              theme={theme}
              className="[&>svg]:h-auto [&>svg]:max-h-16 [&>svg]:w-auto [&>svg]:max-w-full sm:[&>svg]:max-h-28"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
