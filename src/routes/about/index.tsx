import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/pages/about";

export const Route = createFileRoute("/about/")({ component: About });
