import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/pages/home-page";

export const Route = createFileRoute("/")({
  component: HomePage,
});
