import { GITHUB_PROFILE_URL } from "@/app/constants";

export function Footer() {
  return (
    <footer className="w-full bg-background font-light">
      <div className="p-4 text-primary/80 text-center font-mono text-xs leading-loose">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline underline-offset-4"
        >
          <div>Made by ChingRu (rutopio@Github)</div>
        </a>
        <div>
          Noted that Color Font format is not supported on some devices and
          browsers. <br />
          Use Desktop Chrome for best experience.
        </div>
      </div>
    </footer>
  );
}
