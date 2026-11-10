import { SectionHeadingAnchor } from "@rutopio/base-component/section-heading-anchor";
import { copySectionLink } from "@rutopio/base-component/section-navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function ArticleHeading({
  id,
  children,
  level = 2,
}: {
  id: string;
  children: string;
  level?: 2 | 3;
}) {
  const { t } = useTranslation();
  const Heading = level === 3 ? "h3" : "h2";

  const handleCopySectionLink = () => {
    void copySectionLink(
      id,
      () => toast.success(t("imgApi.copied")),
      () => toast.error(t("imgApi.copyFailed"))
    );
  };

  return (
    <Heading
      id={id}
      className="group flex scroll-mt-14 items-center text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50"
    >
      <SectionHeadingAnchor
        id={id}
        title={t("imgApi.copyAria")}
        onClick={handleCopySectionLink}
      >
        {children}
      </SectionHeadingAnchor>
      {level === 2 && (
        <span
          aria-hidden="true"
          className="ml-4 h-0.5 min-w-4 flex-1 scale-y-50 bg-border"
        />
      )}
    </Heading>
  );
}
