import { CircleNotchIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionButtons } from "@/components/mahjong/action-buttons";
import { InputSection } from "@/components/mahjong/input-section";
import { MahjongPreview } from "@/components/mahjong/mahjong-preview";
import { NotationsModal } from "@/components/mahjong/notations-modal";
import { useMahjongState } from "@/hooks/use-mahjong-state";
import { transformString } from "@/lib/transform-string";

export function Home() {
  const { t, ready } = useTranslation();
  const {
    input,
    setInput,
    selectedOption,
    theme,
    setTheme,
    tileColor,
    setTileColor,
    handleOptionChange,
  } = useMahjongState();
  const [showNotations, setShowNotations] = useState(false);

  const transformedText = transformString(input);

  if (!ready) {
    return (
      <div
        className="flex h-dvh w-full items-center justify-center"
        role="status"
        aria-busy="true"
        aria-label="Loading"
      >
        <CircleNotchIcon
          className="size-12 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto my-auto flex w-full flex-col items-center gap-8 p-6 lg:max-w-5xl">
      <h1 className="text-balance text-center font-semibold text-2xl">
        {t("ui.toolTitle")}
      </h1>

      <InputSection
        input={input}
        onInputChange={setInput}
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
        theme={theme}
        onThemeChange={setTheme}
        onShowNotations={() => setShowNotations(true)}
        tileColor={tileColor}
        onColorChange={setTileColor}
      />

      <MahjongPreview
        text={transformedText}
        theme={theme}
        tileColor={tileColor}
      />

      {/* Always render to reserve layout space so the centered column does not
          shift when the buttons appear; hide it until there is input. */}
      <div className={input ? undefined : "invisible"} aria-hidden={!input}>
        <ActionButtons
          text={transformedText}
          theme={theme}
          tileColor={tileColor}
        />
      </div>

      <NotationsModal
        open={showNotations}
        onOpenChange={setShowNotations}
        theme={theme}
      />
    </div>
  );
}
