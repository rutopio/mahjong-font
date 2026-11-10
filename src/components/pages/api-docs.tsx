import { CheckIcon, CircleNotchIcon, CopyIcon } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
const EXAMPLES: { labelKey: string; path: string }[] = [
  {
    labelKey: "imgApi.exampleDefault",
    path: "/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s",
  },
  {
    labelKey: "imgApi.exampleColor",
    path: "/img/1m2m3m4p5p6p7s8s9s?theme=color&color=2D7D46",
  },
  { labelKey: "imgApi.exampleMono", path: "/img/1z2z3z4z5z6z7z?theme=mono" },
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

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t("imgApi.copied"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("imgApi.copyFailed"));
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label={t("imgApi.copyAria")}
      onClick={onCopy}
    >
      {copied ? (
        <CheckIcon aria-hidden="true" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}
    </Button>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50">
      {children}
      <span
        aria-hidden="true"
        className="ml-4 h-0.5 min-w-4 flex-1 scale-y-50 bg-border"
      />
    </h2>
  );
}

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
    <article className="flex w-full min-w-0 flex-col gap-6 py-6 text-base text-neutral-800 tabular-nums leading-[1.65] sm:py-12 dark:text-neutral-300">
      <header className="flex flex-col gap-6">
        <h1 className="text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50">
          {t("imgApi.title")}
        </h1>
        <p className="text-pretty text-base leading-[1.65]">
          {t("imgApi.intro")}
        </p>
      </header>

      <section className="flex min-w-0 flex-col gap-6">
        <SectionHeading>{t("imgApi.urlFormatHeading")}</SectionHeading>
        <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-muted px-4 py-3 font-mono text-base">
          {`${origin}/img/<${t("imgApi.tilePlaceholder")}>?theme=color&color=AA7942`}
        </code>
      </section>

      <section className="flex min-w-0 flex-col gap-6">
        <SectionHeading>{t("imgApi.convertHeading")}</SectionHeading>
        <p className="text-pretty text-base leading-[1.65]">
          <Trans
            i18nKey="imgApi.convertIntro"
            components={{
              from: <Badge variant="outline" className="font-mono" />,
              to: <Badge variant="outline" className="font-mono" />,
            }}
          />
        </p>
        <div className="flex flex-col gap-2">
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
        <SectionHeading>{t("imgApi.paramsHeading")}</SectionHeading>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-base">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">{t("imgApi.colName")}</th>
                <th className="px-4 py-2 font-medium">
                  {t("imgApi.colLocation")}
                </th>
                <th className="px-4 py-2 font-medium">{t("imgApi.colType")}</th>
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
                <tr key={p.name} className="border-t align-top last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="font-medium font-mono">{p.name}</code>
                      {p.required && (
                        <Badge variant="secondary" className="font-normal">
                          {t("imgApi.required")}
                        </Badge>
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
        <SectionHeading>{t("imgApi.examplesHeading")}</SectionHeading>
        {EXAMPLES.map((ex) => {
          const fullUrl = `${origin}${ex.path}`;
          const label = t(ex.labelKey);
          return (
            <div
              key={ex.path}
              className="flex flex-col gap-2 rounded-md border p-4"
            >
              <span className="font-medium text-base">{label}</span>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto whitespace-nowrap rounded bg-muted px-3 py-2 font-mono text-sm">
                  {fullUrl}
                </code>
                <CopyButton text={fullUrl} />
              </div>
              <div className="flex items-center justify-center overflow-x-auto rounded bg-white p-4">
                <img
                  src={ex.path}
                  alt={label}
                  className="h-auto max-h-20 w-auto max-w-full"
                />
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex min-w-0 flex-col gap-6">
        <SectionHeading>{t("imgApi.embedHeading")}</SectionHeading>
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
  );
}
