import { createFileRoute } from "@tanstack/react-router";

import { ApiDocsPage } from "@/components/pages/api-docs-page";

export const Route = createFileRoute("/en/api/")({
  component: ApiDocsPage,
});
