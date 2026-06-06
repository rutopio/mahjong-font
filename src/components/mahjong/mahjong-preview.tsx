import { useTranslation } from "react-i18next";

import { TileSvg } from "@/components/mahjong/tile-svg";

interface MahjongPreviewProps {
  text: string;
  theme: string;
  tileColor: string;
}

export function MahjongPreview({
  text,
  theme,
  tileColor,
}: MahjongPreviewProps) {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto flex w-full items-center justify-center overflow-hidden">
      <TileSvg
        text={text}
        theme={theme}
        tileColor={tileColor}
        ariaLabel={t("ui.mahjongPreview")}
        className="[&>svg]:h-auto [&>svg]:max-h-48 [&>svg]:w-full"
      />
    </div>
  );
}
