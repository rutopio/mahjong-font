import { createFileRoute } from "@tanstack/react-router";

import { Home } from "@/components/pages/home";

export const Route = createFileRoute("/zh_tw/")({
  component: Home,
});
