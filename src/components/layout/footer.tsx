export function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="w-full py-12 text-center font-mono text-muted-foreground text-sm">
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://github.com/rutopio/mahjong-font"
            target="_blank"
            rel="noreferrer"
            className="block rounded-sm hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
          >
            rutopio/mahjong-font
          </a>
          <a
            href="https://chingru.com"
            target="_blank"
            rel="noreferrer"
            className="block rounded-sm hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
          >
            Created by ChingRu
          </a>
        </div>
      </div>
    </footer>
  );
}
