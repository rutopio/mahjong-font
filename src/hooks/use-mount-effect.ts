import { type EffectCallback, useEffect } from "react";

// For one-time synchronization with systems outside React. Callers should not
// use this to derive state that can be calculated during render.
export function useMountEffect(effect: EffectCallback) {
  useEffect(effect, []);
}
