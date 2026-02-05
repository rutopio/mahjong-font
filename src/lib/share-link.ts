/** Opens Facebook share dialog with the current page URL. */
export function shareToFacebook() {
  const currentUrl = window.location.href;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;
  window.open(url, "_blank");
}

/** Opens X (Twitter) share dialog with the current page URL. */
export function shareToX() {
  const currentUrl = window.location.href;
  const url = `https://x.com/intent/post?text=${encodeURIComponent(currentUrl)}`;
  window.open(url, "_blank");
}

/** Opens Threads share dialog with the current page URL. */
export function shareToThreads() {
  const currentUrl = window.location.href;
  const url = `https://www.threads.com/intent/post?text=${encodeURIComponent(currentUrl)}`;
  window.open(url, "_blank");
}

/** Copies the current page URL to the clipboard. */
export function copyLink() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl);
}
