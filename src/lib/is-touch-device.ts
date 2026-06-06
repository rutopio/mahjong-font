/**
 * Detects touch-first devices (phones and tablets, including iPadOS Safari
 * which defaults to a desktop user-agent). Used to route share/download through
 * the native share sheet and to swap in the OS-native color picker.
 *
 * Uses pointer/touch capability rather than user-agent or viewport width, so
 * iPads count as mobile regardless of width or the spoofed Mac UA.
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0
  );
}
