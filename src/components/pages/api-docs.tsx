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
          className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
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
    <div className="mx-auto flex w-full flex-col gap-10 p-6 lg:max-w-3xl">
      <header className="flex flex-col gap-3">
        <h1 className="text-balance font-semibold text-2xl">
          {t("imgApi.title")}
        </h1>
        <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
          {t("imgApi.intro")}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-balance font-semibold text-lg">
          {t("imgApi.urlFormatHeading")}
        </h2>
        <code className="block overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-sm">
          {`${origin}/img/<${t("imgApi.tilePlaceholder")}>?theme=color&color=AA7942`}
        </code>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-balance font-semibold text-lg">
          {t("imgApi.convertHeading")}
        </h2>
        <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
          <Trans
            i18nKey="imgApi.convertIntro"
            components={{
              from: <Badge variant="outline" className="font-mono" />,
              to: <Badge variant="outline" className="font-mono" />,
            }}
          />
        </p>
        <div className="flex flex-col gap-2">
          <code className="block overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-xs">
            {origin}/<span className="text-destructive">?tile=</span>
            7m7m7m2p3p4p8p8p8p4s5s6s8s_8s&amp;theme=color&amp;color=AA7942
          </code>
          <code className="block overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-xs">
            {origin}
            <span className="text-destructive">/img/</span>
            7m7m7m2p3p4p8p8p8p4s5s6s8s_8s?theme=color&amp;color=AA7942
          </code>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-balance font-semibold text-lg">
          {t("imgApi.paramsHeading")}
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
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
                    <code className="font-mono text-muted-foreground text-xs">
                      {p.location}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="break-words font-mono text-primary text-xs">
                      {p.type}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    {p.default ? (
                      <code className="font-mono text-muted-foreground text-xs">
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

      <section className="flex flex-col gap-4">
        <h2 className="text-balance font-semibold text-lg">
          {t("imgApi.examplesHeading")}
        </h2>
        {EXAMPLES.map((ex) => {
          const fullUrl = `${origin}${ex.path}`;
          const label = t(ex.labelKey);
          return (
            <div
              key={ex.path}
              className="flex flex-col gap-2 rounded-md border p-4"
            >
              <span className="font-medium text-sm">{label}</span>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto whitespace-nowrap rounded bg-muted px-3 py-2 font-mono text-xs">
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

      <section className="flex flex-col gap-3">
        <h2 className="text-balance font-semibold text-lg">
          {t("imgApi.embedHeading")}
        </h2>
        <p className="text-muted-foreground text-sm">Markdown:</p>
        <code className="block overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-xs">
          {`![](${origin}/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s)`}
        </code>
        <p className="text-muted-foreground text-sm">HTML:</p>
        <code className="block overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-xs">
          {`<img src="${origin}/img/7m7m7m2p3p4p8p8p8p4s5s6s8s_8s" />`}
        </code>
      </section>
    </div>
  );
}
