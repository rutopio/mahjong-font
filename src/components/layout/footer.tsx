import { GITHUB_PROFILE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-background">
      <div className="w-full py-12 text-center font-mono text-muted-foreground/60 text-sm">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Created by ChingRu (rutopio@Github), opens in new tab"
          className="block rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span>Created by ChingRu</span>
        </a>
      </div>
    </footer>
  );
}
