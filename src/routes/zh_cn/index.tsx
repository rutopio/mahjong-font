import { createFileRoute } from "@tanstack/react-router";

import { Home } from "@/components/pages/home-page";

export const Route = createFileRoute("/zh_cn/")({
  component: Home,
});
