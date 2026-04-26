import type { MetadataRoute } from "next";

import { LEGACY_PAGES } from "@/lib/page-map";
import { buildAbsoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LEGACY_PAGES.map((page) => ({
    url: buildAbsoluteUrl(page.route),
    lastModified: now,
    changeFrequency: "weekly",
    priority: page.route === "/" ? 1 : 0.8,
  }));
}
