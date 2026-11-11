import { createFileRoute } from "@tanstack/react-router";

import { ApiDocs } from "@/components/pages/api-docs-page";

export const Route = createFileRoute("/zh_cn/api/")({
  component: ApiDocs,
});
