import { useState } from "react";

import { optionValues } from "@/lib/constants";
import { expandMahjongNotation } from "@/lib/mahjong-notation";
import { decodeFromQuery, encodeToQuery } from "@/lib/url-state";

const findMatchingOption = (inputValue: string): string => {
  for (const [key, value] of Object.entries(optionValues)) {
    if (value === inputValue || expandMahjongNotation(value) === inputValue) {
      return key;
    }
  }
  return "";
};

const getInitialState = () => decodeFromQuery(window.location.search);

// Initialize from the shared URL, not a previous visitor session.
export function useMahjongState() {
  const [state, setState] = useState(getInitialState);
  const { input, theme, tileColor } = state;
  const selectedOption = findMatchingOption(input);

  const update = (next: typeof state) => {
    setState(next);
    const encoded = encodeToQuery(next);
    const current = window.location.search.slice(1);
    if (current !== encoded) {
      const url = `${window.location.pathname}?${encoded}${window.location.hash}`;
      window.history.replaceState(null, "", url);
    }
  };

  const setInput = (value: string) => update({ ...state, input: value });
  const setTheme = (value: string) => update({ ...state, theme: value });
  const setTileColor = (value: string) =>
    update({ ...state, tileColor: value });

  const handleOptionChange = (value: string) => {
    const option = optionValues[value as keyof typeof optionValues];
    if (option === undefined) return;
    const transformedValue = expandMahjongNotation(option);
    setInput(transformedValue);
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
