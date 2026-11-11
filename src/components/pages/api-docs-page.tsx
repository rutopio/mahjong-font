import { CircleNotchIcon } from "@phosphor-icons/react";
import { Article, ArticleSection } from "@rutopio/ui/article";
import type { OutlineListItem as OutlineItem } from "@rutopio/ui/outline-list";
import { PageIntro } from "@rutopio/ui/page-intro";
import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ArticleHeading } from "@/components/article/article-heading";
import { ApiPageActions } from "@/components/navigation/api-page-actions";

const INLINE_MARKUP_RE = /(`[^`]+`|\*\*[^*]+\*\*)/;

function parseDescription(text: string): ReactNode {
  return text.split(INLINE_MARKUP_RE).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, stable order
          key={i}
          className="bg-muted rounded px-1 py-0.5 font-mono text-base"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      // biome-ignore lint/suspicious/noArrayIndexKey: static split, stable order
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const EXAMPLES: { id: string; labelKey: string; path: string }[] = [
  {
    id: "example-default",
    labelKey: "imgApi.exampleDefault",
    path: "/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s",
  },
  {
    id: "example-color",
    labelKey: "imgApi.exampleColor",
    path: "/img/1m2m3m4p5p6p7s8s9s?theme=color&color=2D7D46",
  },
  {
    id: "example-mono",
    labelKey: "imgApi.exampleMono",
    path: "/img/1z2z3z4z5z6z7z?theme=mono",
  },
];

const EMBED_TILE = "7m7m7m2p3p4p8p8p8p4s5s6s8s_8s";

const PARAMS: {
  name: string;
  location: "path" | "query";
  type: string;
  default?: string;
  required?: boolean;
  descKey: string;
}[] = [
  {
    name: "tile",
    location: "path",
    type: "string",
    required: true,
    descKey: "imgApi.paramTileDesc",
  },
  {
    name: "theme",
    location: "query",
    type: "color | mono",
    default: "color",
    descKey: "imgApi.paramThemeDesc",
  },
  {
    name: "color",
    location: "query",
    type: "string (hex)",
    default: "AA7942",
    descKey: "imgApi.paramColorDesc",
  },
];

export function ApiDocsPage() {
  const { t, ready } = useTranslation();
  const outlineItems: OutlineItem[] = [
    { id: "url-format", label: t("imgApi.urlFormatHeading"), depth: 2 },
    { id: "convert-shared-url", label: t("imgApi.convertHeading"), depth: 2 },
    { id: "parameters", label: t("imgApi.paramsHeading"), depth: 2 },
    { id: "examples", label: t("imgApi.examplesHeading"), depth: 2 },
    ...EXAMPLES.map((example) => ({
      id: example.id,
      label: t(example.labelKey),
      depth: 3 as const,
    })),
    { id: "embedding", label: t("imgApi.embedHeading"), depth: 2 },
  ];
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const embedUrl = `${origin}/img/${EMBED_TILE}`;
  const embedAlt = t("imgApi.embedAlt", { tile: EMBED_TILE });

  if (!ready) {
    return (
      <div
        className="flex h-full w-full items-center justify-center p-12"
        role="status"
        aria-busy="true"
        aria-label={t("ui.loading")}
      >
        <CircleNotchIcon
          className="size-12 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <>
      <Article className="py-6 sm:py-12">
        <header className="flex flex-col gap-6">
          <PageIntro title={t("imgApi.title")} />
          <p className="text-base leading-[1.65] text-pretty">
            {t("imgApi.intro")}
          </p>
        </header>

        <ArticleSection
          heading={
            <ArticleHeading id="url-format">
              {t("imgApi.urlFormatHeading")}
            </ArticleHeading>
          }
        >
          <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
            {`${origin}/img/<${t("imgApi.tilePlaceholder")}>?theme=color&color=AA7942`}
          </code>
          <p className="text-pretty">
            {parseDescription(t("imgApi.encodingIntro"))}
          </p>
          <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
            {`const imageUrl = \`${origin}/img/\${encodeURIComponent(tile)}\`;`}
          </code>
        </ArticleSection>

        <ArticleSection
          heading={
            <ArticleHeading id="convert-shared-url">
              {t("imgApi.convertHeading")}
            </ArticleHeading>
          }
        >
          <p className="text-base leading-[1.65] text-pretty">
            <Trans
              i18nKey="imgApi.convertIntro"
              components={{
                from: (
                  <code className="bg-muted rounded px-1 py-0.5 font-mono" />
                ),
                to: <code className="bg-muted rounded px-1 py-0.5 font-mono" />,
              }}
            />
          </p>
          <div className="flex flex-col gap-6">
            <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
              {origin}/<span className="text-destructive">?tile=</span>
              7m7m7m2p3p4p8p8p8p4s5s6s8s_8s&amp;theme=color&amp;color=AA7942
            </code>
            <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
              {origin}
              <span className="text-destructive">/img/</span>
              7m7m7m2p3p4p8p8p8p4s5s6s8s_8s?theme=color&amp;color=AA7942
            </code>
          </div>
        </ArticleSection>

        <ArticleSection
          heading={
            <ArticleHeading id="parameters">
              {t("imgApi.paramsHeading")}
            </ArticleHeading>
          }
        >
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-base leading-[1.65]">
              <thead className="bg-muted text-muted-foreground text-left">
                <tr>
                  <th className="px-4 py-2 font-semibold">
                    {t("imgApi.colName")}
                  </th>
                  <th className="px-4 py-2 font-semibold">
                    {t("imgApi.colLocation")}
                  </th>
                  <th className="px-4 py-2 font-semibold">
                    {t("imgApi.colType")}
                  </th>
                  <th className="px-4 py-2 font-semibold">
                    {t("imgApi.colDefault")}
                  </th>
                  <th className="px-4 py-2 font-semibold">
                    {t("imgApi.colDescription")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PARAMS.map((p) => (
                  <tr
                    key={p.name}
                    className="border-t align-top last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-semibold">
                          {p.name}
                        </code>
                        {p.required && (
                          <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-base">
                            {t("imgApi.required")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-muted-foreground font-mono text-base">
                        {p.location}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-primary font-mono text-base break-words">
                        {p.type}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {p.default ? (
                        <code className="text-muted-foreground font-mono text-base">
                          {p.default}
                        </code>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {parseDescription(t(p.descKey))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-pretty">
            {t("imgApi.inputRules")}
          </p>
        </ArticleSection>

        <ArticleSection
          heading={
            <ArticleHeading id="examples">
              {t("imgApi.examplesHeading")}
            </ArticleHeading>
          }
        >
          <div className="flex min-w-0 flex-col gap-16">
            {EXAMPLES.map((ex) => {
              const fullUrl = `${origin}${ex.path}`;
              const label = t(ex.labelKey);
              return (
                <ArticleSection
                  key={ex.id}
                  heading={
                    <ArticleHeading id={ex.id} level={3}>
                      {label}
                    </ArticleHeading>
                  }
                >
                  <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
                    {fullUrl}
                  </code>
                  <div className="flex min-h-20 items-center justify-center overflow-x-auto">
                    <img
                      src={ex.path}
                      alt={label}
                      className="h-auto max-h-20 w-auto max-w-full"
                    />
                  </div>
                </ArticleSection>
              );
            })}
          </div>
        </ArticleSection>

        <ArticleSection
          heading={
            <ArticleHeading id="embedding">
              {t("imgApi.embedHeading")}
            </ArticleHeading>
          }
        >
          <p className="text-muted-foreground text-base">Markdown:</p>
          <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
            {`![${embedAlt}](${embedUrl})`}
          </code>
          <p className="text-muted-foreground text-base">HTML:</p>
          <code className="bg-muted block overflow-x-auto rounded-md px-4 py-3 font-mono text-base whitespace-nowrap">
            {`<img src="${embedUrl}" alt="${embedAlt}" />`}
          </code>
        </ArticleSection>
      </Article>
      <ApiPageActions items={outlineItems} />
    </>
  );
}
