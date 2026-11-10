import { useLang } from "@/hooks/use-lang";

const AUTHOR_LABEL = {
  ja: "ChingRu のウェブサイト（新しいタブで開く）",
  en: "ChingRu's website (opens in a new tab)",
  "zh-TW": "ChingRu 的網站（在新分頁開啟）",
  "zh-CN": "ChingRu 的网站（在新标签页打开）",
} as const;

export function Footer() {
  const lang = useLang();
  return (
    <footer className="mt-auto w-full bg-background">
      <div className="w-full py-12 text-center font-mono text-muted-foreground text-sm">
        <a
          href="https://chingru.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={AUTHOR_LABEL[lang]}
          className="block rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span>Created by ChingRu</span>
        </a>
      </div>
    </footer>
  );
}
