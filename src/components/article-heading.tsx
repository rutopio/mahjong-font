import { LinkIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function ArticleHeading({
  id,
  children,
}: {
  id: string;
  children: string;
}) {
  const { t } = useTranslation();

  const copySectionLink = () => {
    const url = new URL(window.location.href);
    url.hash = id;
    navigator.clipboard.writeText(url.href).then(
      () => toast.success(t("imgApi.copied")),
      () => toast.error(t("imgApi.copyFailed"))
    );
  };

  return (
    <h2
      id={id}
      className="group flex scroll-mt-14 items-center text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50"
    >
      <a
        href={`#${id}`}
        title={t("imgApi.copyAria")}
        onClick={copySectionLink}
        className="relative inline text-inherit no-underline"
      >
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-6 flex h-4 w-5 -translate-y-1/2 items-center justify-end opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 sm:-left-8"
        >
          <LinkIcon className="size-4 text-neutral-400 dark:text-neutral-500" />
        </span>
        {children}
      </a>
      <span
        aria-hidden="true"
        className="ml-4 h-0.5 min-w-4 flex-1 scale-y-50 bg-border"
      />
    </h2>
  );
}
