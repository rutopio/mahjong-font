import { GITHUB_PROFILE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="container w-full bg-background font-light">
      <div className="p-4 text-center font-mono text-xs leading-loose text-primary/80">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
        >
          <span className="block">Made by ChingRu (rutopio@Github)</span>
        </a>
        <a
          href="https://caniuse.com/colr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
        >
          <span className="block">
            Color Font is not compatible with some browsers.
          </span>
        </a>
        <p>Use Desktop Chrome for best experience.</p>
      </div>
    </footer>
  );
}
