import { SectionHeading } from "@rutopio/ui/section-heading";
import { copySectionLink } from "@rutopio/ui/section-navigation";
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

  const handleCopySectionLink = () => {
    void copySectionLink(
      id,
      () => toast.success(t("imgApi.copied")),
      () => toast.error(t("imgApi.copyFailed"))
    );
  };

  return (
    <SectionHeading
      id={id}
      level={level}
      linkTitle={t("imgApi.copyAria")}
      onLinkClick={handleCopySectionLink}
    >
      {children}
    </SectionHeading>
  );
}
