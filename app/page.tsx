import type { Metadata } from "next";

import LegacyPage from "@/components/legacy-page";
import { loadLegacyHtml } from "@/lib/legacy-html";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadLegacyHtml("index.html");
  return buildPageMetadata({
    route: "/",
    title: page.metadata.title,
    description: page.metadata.description,
  });
}

export default async function HomePage() {
  const page = await loadLegacyHtml("index.html");
  return (
    <LegacyPage
      bodyHtml={page.bodyHtml}
      bodyClassName={page.bodyClassName}
      styles={page.styles}
      scripts={page.scripts}
    />
  );
}
