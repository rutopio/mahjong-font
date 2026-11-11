import { Article, ArticleSection } from "@rutopio/ui/article";
import { GithubMarkIcon } from "@rutopio/ui/github-mark-icon";
import type { OutlineListItem as OutlineItem } from "@rutopio/ui/outline-list";
import { PageIntro } from "@rutopio/ui/page-intro";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ApiPageActions } from "@/components/api-page-actions";
import { ArticleHeading } from "@/components/article-heading";
import { useLang } from "@/hooks/use-lang";
import { fontDownloads, GITHUB_REPO_URL } from "@/lib/constants";
import { withLocale } from "@/lib/locale";

const linkClass =
  "break-words text-primary underline decoration-[0.5px] underline-offset-4 transition-[color,text-decoration-thickness] duration-150 hover:decoration-[1px]";

export function About() {
  const { t } = useTranslation();
  const lang = useLang();
  const outlineItems: OutlineItem[] = [
    { id: "source-code", label: t("about.sourceHeading"), depth: 2 },
    { id: "downloads", label: t("about.downloadsHeading"), depth: 2 },
    { id: "license", label: t("about.licenseHeading"), depth: 2 },
  ];

  return (
    <>
      <Article className="py-6 sm:py-12">
        <header className="flex flex-col gap-6">
          <PageIntro title={t("about.title")} />
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

        <ArticleSection
          heading={
            <ArticleHeading id="source-code">
              {t("about.sourceHeading")}
            </ArticleHeading>
          }
        >
          <p className="text-pretty">
            <a
              href={GITHUB_REPO_URL}
              className={`${linkClass} whitespace-nowrap`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                aria-hidden="true"
                className="mr-1 inline-block h-4 w-4 align-[-0.125em] text-primary [&>svg]:size-full"
              >
                <GithubMarkIcon />
              </span>
              rutopio/mahjong-font
            </a>
          </p>
        </ArticleSection>

        <ArticleSection
          heading={
            <ArticleHeading id="downloads">
              {t("about.downloadsHeading")}
            </ArticleHeading>
          }
        >
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
        </ArticleSection>

        <ArticleSection
          heading={
            <ArticleHeading id="license">
              {t("about.licenseHeading")}
            </ArticleHeading>
          }
        >
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
        </ArticleSection>
      </Article>
      <ApiPageActions
        items={outlineItems}
        pageTitle={t("about.title")}
        actionsLabel={t("about.actionsLabel")}
      />
    </>
  );
}
