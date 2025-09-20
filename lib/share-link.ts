export function shareToFacebook() {
  const currentUrl = window.location.href;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl,
  )}`;
  window.open(url, "_blank");
}

export function shareToX() {
  const currentUrl = window.location.href;
  const url = `https://x.com/intent/tweet?text=${encodeURIComponent(currentUrl)}`;
  window.open(url, "_blank");
}

export function shareToThreads() {
  const currentUrl = window.location.href;
  const url = `https://threads.net/intent/post?text=${encodeURIComponent(currentUrl)}`;
  window.open(url, "_blank");
}

export function copyLink() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl);
}
