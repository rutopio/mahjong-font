export function Footer() {
  return (
    <footer className="mt-auto w-full bg-background">
      <div className="w-full py-12 text-center font-mono text-muted-foreground/60 text-sm">
        <a
          href="https://chingru.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ChingRu's website (opens in a new tab)"
          className="block rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span>Created by ChingRu</span>
        </a>
      </div>
    </footer>
  );
}
