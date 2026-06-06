import { GITHUB_PROFILE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="container w-full bg-background font-light">
      <div className="p-4 text-center font-mono text-primary/80 text-xs leading-loose md:p-12">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Created by ChingRu (rutopio@Github), opens in new tab"
          className="rounded-sm underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="block">Created by ChingRu (rutopio@Github)</span>
        </a>
      </div>
    </footer>
  );
}
