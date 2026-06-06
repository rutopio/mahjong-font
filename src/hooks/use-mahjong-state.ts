import { useEffect, useState } from "react";

import { optionValues } from "@/lib/constants";
import { transformString } from "@/lib/transform-string";
import { decodeFromQuery, encodeToQuery } from "@/lib/url-state";

const findMatchingOption = (inputValue: string): string => {
  for (const [key, value] of Object.entries(optionValues)) {
    if (value === inputValue || transformString(value) === inputValue) {
      return key;
    }
  }
  return "";
};

const getInitialState = () => decodeFromQuery(window.location.search);

/**
 * Owns the generator's core state (input, theme, tile color) and keeps it in
 * sync with the URL query string. Also derives the matching yaku option for the
 * current input. localStorage is intentionally not used; a URL without params
 * (or a malformed one) always falls back to the default state.
 */
export function useMahjongState() {
  const initial = getInitialState();
  const [input, setInput] = useState(initial.input);
  const [selectedOption, setSelectedOption] = useState(() =>
    findMatchingOption(initial.input)
  );
  const [theme, setTheme] = useState(initial.theme);
  const [tileColor, setTileColor] = useState(initial.tileColor);

  // Keep the query string in sync with state, without adding history entries.
  useEffect(() => {
    if (!input) return;
    const encoded = encodeToQuery({ input, theme, tileColor });
    const current = window.location.search.slice(1);
    if (current !== encoded) {
      const url = `${window.location.pathname}?${encoded}${window.location.hash}`;
      window.history.replaceState(null, "", url);
    }
  }, [input, theme, tileColor]);

  const handleOptionChange = (value: string) => {
    const transformedValue = transformString(
      optionValues[value as keyof typeof optionValues]
    );
    setInput(transformedValue);
    setSelectedOption(value);
  };

  return {
    input,
    setInput,
    selectedOption,
    theme,
    setTheme,
    tileColor,
    setTileColor,
    handleOptionChange,
  };
}
