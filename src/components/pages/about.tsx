import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ArticleHeading } from "@/components/article-heading";
import { useLang } from "@/hooks/use-lang";
import { fontDownloads, GITHUB_REPO_URL } from "@/lib/constants";
import { withLocale } from "@/lib/locale";

const linkClass =
  "break-words text-primary underline decoration-[0.5px] underline-offset-4 transition-[color,text-decoration-thickness] duration-150 hover:decoration-[1px]";

export function About() {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <article className="flex w-full min-w-0 flex-col gap-16 py-6 text-base text-neutral-800 tabular-nums leading-[1.65] sm:py-12 dark:text-neutral-300">
      <header className="flex flex-col gap-6">
        <h1 className="text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50">
          {t("about.title")}
        </h1>
        <p className="text-pretty">{t("about.intro")}</p>
        <p className="text-pretty">{t("about.features")}</p>
        <p className="text-pretty">
          {t("about.apiPrefix")}
          <Link to={withLocale("/api", lang)} className={linkClass}>
            {t("about.apiLink")}
          </Link>
          {t("about.apiSuffix")}
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <ArticleHeading id="source-code">
          {t("about.sourceHeading")}
        </ArticleHeading>
        <p className="text-pretty">
          GitHub:{" "}
          <a
            href={GITHUB_REPO_URL}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            @rutopio/mahjong-font
          </a>
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <ArticleHeading id="downloads">
          {t("about.downloadsHeading")}
        </ArticleHeading>
        <ul className="ml-6 flex list-disc flex-col gap-1">
          {fontDownloads.map((font) => (
            <li key={font.url}>
              <a
                href={font.url}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(font.labelKey)} (.otf)
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <ArticleHeading id="license">
          {t("about.licenseHeading")}
        </ArticleHeading>
        <ul className="ml-6 flex list-disc flex-col gap-1">
          <li>
            <a
              href={`${GITHUB_REPO_URL}/blob/main/LICENSE-FONT`}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("about.fontLicense")}
            </a>
          </li>
          <li>
            <a
              href={`${GITHUB_REPO_URL}/blob/main/LICENSE`}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("about.codeLicense")}
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
