import { createFileRoute } from "@tanstack/react-router";

import { ApiDocs } from "@/components/pages/api-docs";

export const Route = createFileRoute("/zh_tw/api/")({
  component: ApiDocs,
});
