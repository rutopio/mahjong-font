import { CircleNotchIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ApiPageActions } from "@/components/api-page-actions";
import { ArticleHeading } from "@/components/article-heading";

/** Render `code` and **bold** markers inside a param description. */
function parseDescription(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, stable order
          key={i}
          className="rounded bg-muted px-1 py-0.5 font-mono text-base"
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

/** Example tile strings; labels are i18n keys resolved at render time. */
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

/** Param rows: name/location/type/default are code symbols; only desc is i18n. */
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

export function ApiDocs() {
  const { t, ready } = useTranslation();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (!ready) {
    return (
      <div
        className="flex h-full w-full items-center justify-center p-12"
        role="status"
        aria-busy="true"
        aria-label="Loading"
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
      <article className="flex w-full min-w-0 flex-col gap-16 py-6 text-base text-neutral-800 tabular-nums leading-[1.65] sm:py-12 dark:text-neutral-300">
        <header className="flex flex-col gap-6">
          <h1 className="text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50">
            {t("imgApi.title")}
          </h1>
          <p className="text-pretty text-base leading-[1.65]">
            {t("imgApi.intro")}
          </p>
        </header>

        <section className="flex min-w-0 flex-col gap-6">
          <ArticleHeading id="url-format">
            {t("imgApi.urlFormatHeading")}
          </ArticleHeading>
          <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
            {`${origin}/img/<${t("imgApi.tilePlaceholder")}>?theme=color&color=AA7942`}
          </code>
        </section>

        <section className="flex min-w-0 flex-col gap-6">
          <ArticleHeading id="convert-shared-url">
            {t("imgApi.convertHeading")}
          </ArticleHeading>
          <p className="text-pretty text-base leading-[1.65]">
            <Trans
              i18nKey="imgApi.convertIntro"
              components={{
                from: (
                  <code className="rounded bg-muted px-1 py-0.5 font-mono" />
                ),
                to: <code className="rounded bg-muted px-1 py-0.5 font-mono" />,
              }}
            />
          </p>
          <div className="flex flex-col gap-6">
            <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
              {origin}/<span className="text-destructive">?tile=</span>
              7m7m7m2p3p4p8p8p8p4s5s6s8s_8s&amp;theme=color&amp;color=AA7942
            </code>
            <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
              {origin}
              <span className="text-destructive">/img/</span>
              7m7m7m2p3p4p8p8p8p4s5s6s8s_8s?theme=color&amp;color=AA7942
            </code>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-6">
          <ArticleHeading id="parameters">
            {t("imgApi.paramsHeading")}
          </ArticleHeading>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-base">
              <thead className="bg-muted text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">
                    {t("imgApi.colName")}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {t("imgApi.colLocation")}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {t("imgApi.colType")}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {t("imgApi.colDefault")}
                  </th>
                  <th className="px-4 py-2 font-medium">
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
                        <code className="font-medium font-mono">{p.name}</code>
                        {p.required && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-base text-secondary-foreground">
                            {t("imgApi.required")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-base text-muted-foreground">
                        {p.location}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="break-words font-mono text-primary text-sm">
                        {p.type}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {p.default ? (
                        <code className="font-mono text-base text-muted-foreground">
                          {p.default}
                        </code>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {parseDescription(t(p.descKey))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-6">
          <ArticleHeading id="examples">
            {t("imgApi.examplesHeading")}
          </ArticleHeading>
          <div className="flex min-w-0 flex-col gap-16">
            {EXAMPLES.map((ex) => {
              const fullUrl = `${origin}${ex.path}`;
              const label = t(ex.labelKey);
              return (
                <section key={ex.id} className="flex min-w-0 flex-col gap-6">
                  <ArticleHeading id={ex.id} level={3}>
                    {label}
                  </ArticleHeading>
                  <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
                    {fullUrl}
                  </code>
                  <div className="flex min-h-20 items-center justify-center overflow-x-auto">
                    <img
                      src={ex.path}
                      alt={label}
                      className="h-auto max-h-20 w-auto max-w-full"
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-6">
          <ArticleHeading id="embedding">
            {t("imgApi.embedHeading")}
          </ArticleHeading>
          <p className="text-base text-muted-foreground">Markdown:</p>
          <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
            {`![](${origin}/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s)`}
          </code>
          <p className="text-base text-muted-foreground">HTML:</p>
          <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
            {`<img src="${origin}/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s" />`}
          </code>
        </section>
      </article>
      <ApiPageActions />
    </>
  );
}
