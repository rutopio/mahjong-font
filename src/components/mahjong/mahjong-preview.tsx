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
    <div className="relative mx-auto flex min-h-14 w-full items-center justify-center overflow-hidden lg:min-h-24">
      <TileSvg
        text={text}
        theme={theme}
        tileColor={tileColor}
        ariaLabel={t("ui.mahjongPreview")}
        className="[&>svg]:h-auto [&>svg]:max-h-14 [&>svg]:w-auto [&>svg]:max-w-full lg:[&>svg]:max-h-24"
      />
    </div>
  );
}
