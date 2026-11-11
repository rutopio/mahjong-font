import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/pages/about-page";

export const Route = createFileRoute("/about/")({ component: About });
