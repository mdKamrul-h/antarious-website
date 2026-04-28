import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LegacyPage from "@/components/legacy-page";
import { buildFaqSchema, extractFaqItemsFromBodyHtml } from "@/lib/faq-schema";
import { loadLegacyHtml } from "@/lib/legacy-html";
import { getLegacyPageByRoute, LEGACY_PAGES } from "@/lib/page-map";
import { buildPageMetadata } from "@/lib/seo";
import { getFreyaProductSchema } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const slugToRoute = (slug: string[]): string => `/${slug.join("/")}`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = slugToRoute(slug);
  const pageInfo = getLegacyPageByRoute(route);

  if (!pageInfo) {
    return {};
  }

  const page = await loadLegacyHtml(pageInfo.file);
  return buildPageMetadata({
    route,
    title: page.metadata.title,
    description: page.metadata.description,
  });
}

export async function generateStaticParams() {
  return LEGACY_PAGES.filter((page) => page.route !== "/").map((page) => ({
    slug: page.route.replace(/^\//, "").split("/"),
  }));
}

export default async function CatchAllLegacyPage({ params }: PageProps) {
  const { slug } = await params;
  const route = slugToRoute(slug);
  const pageInfo = getLegacyPageByRoute(route);

  if (!pageInfo) {
    notFound();
  }

  const page = await loadLegacyHtml(pageInfo.file);
  const faqSchema =
    route === "/faq/comprehensive"
      ? buildFaqSchema(extractFaqItemsFromBodyHtml(page.bodyHtml))
      : null;
  const freyaSchema = route === "/freya" ? getFreyaProductSchema() : null;

  return (
    <>
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      {freyaSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(freyaSchema) }}
        />
      ) : null}
      <LegacyPage
        bodyHtml={page.bodyHtml}
        bodyClassName={page.bodyClassName}
        styles={page.styles}
        scripts={page.scripts}
      />
    </>
  );
}
