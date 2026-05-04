import { GITHUB_PROFILE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="container w-full bg-background font-light">
      <div className="p-4 text-center font-mono text-xs leading-loose text-primary/80">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Made by ChingRu (rutopio@Github), opens in new tab"
          className="rounded-sm underline-offset-4 hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="block" aria-hidden="true">
            Made by ChingRu (rutopio@Github)
          </span>
        </a>
        <a
          href="https://caniuse.com/colr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Color Font is not compatible with some browsers, opens in new tab"
          className="rounded-sm underline-offset-4 hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="block" aria-hidden="true">
            Color Font is not compatible with some browsers.
          </span>
        </a>
        <p className="text-pretty">Use Desktop Chrome for best experience.</p>
      </div>
    </footer>
  );
}
