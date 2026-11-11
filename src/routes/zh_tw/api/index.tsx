import { createFileRoute } from "@tanstack/react-router";

import { ApiDocsPage } from "@/components/pages/api-docs-page";

export const Route = createFileRoute("/zh_tw/api/")({
  component: ApiDocsPage,
});
