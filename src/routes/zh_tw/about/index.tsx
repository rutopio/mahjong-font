import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/pages/about";

export const Route = createFileRoute("/zh_tw/about/")({ component: About });
