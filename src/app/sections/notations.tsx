import { useTranslation } from "react-i18next";

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
import {
  notationExamples,
  notationItems,
  type NotationItem,
} from "@/app/constants";

function NotationBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className="rounded-full">
      {children}
    </Badge>
  );
}

function NotationContent({ item, t }: { item: NotationItem; t: (key: string) => string }) {
  switch (item.type) {
    case "range":
      return (
        <>
          <NotationBadge>{item.start}</NotationBadge> ~ <NotationBadge>{item.end}</NotationBadge>
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

export default function Notations({ theme }: { theme: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        {/* Desktop table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tileName")}</TableHead>
                <TableHead>{t("notation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notationItems.map((item) => (
                <TableRow key={item.titleKey}>
                  <TableCell className="font-bold">{t(item.titleKey)}</TableCell>
                  <TableCell className={item.titleKey === "aka-dora" ? "break-words" : ""}>
                    <NotationContent item={item} t={t} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile card layout */}
        <div className="block space-y-3 p-4 sm:hidden">
          {notationItems.map((item, index) => (
            <div key={item.titleKey}>
              {index > 0 && <hr className="border-border mb-3" />}
              <div className="space-y-2">
                <div className="text-sm font-bold">{t(item.titleKey)}</div>
                <div className={`text-sm ${item.titleKey === "aka-dora" ? "break-words" : ""}`}>
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
            key={index}
            className={`flex flex-col border-b p-2 ${index === 3 ? "gap-8" : "gap-4"}`}
          >
            <div className="flex gap-4 p-2 items-center">
              <div className="text-sm font-bold break-words">
                {t(example.combination)}
              </div>
              <Badge
                variant="outline"
                className=" text-sm break-all rounded-full"
              >
                {example.notation}
              </Badge>
            </div>

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
        ))}
      </div>
    </div>
  );
}
