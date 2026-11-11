import { NotFound as NotFoundPage } from "@rutopio/ui/not-found";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/hooks/use-lang";
import { withLocale } from "@/lib/locale";

export function NotFound() {
  const lang = useLang();
  return <NotFoundPage homeLink={<Link to={withLocale("/", lang)} />} />;
}
