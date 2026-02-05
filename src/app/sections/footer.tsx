import { GITHUB_PROFILE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="container w-full bg-background font-light">
      <div className="p-4 text-center font-mono text-xs leading-loose text-primary/80">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          <div>Made by ChingRu (rutopio@Github)</div>
        </a>
        <a
          href="https://caniuse.com/colr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          <div>Color Font is not compatible with some browsers. </div>
        </a>
        <div>Use Desktop Chrome for best experience.</div>
      </div>
    </footer>
  );
}
