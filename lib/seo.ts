import type { Metadata } from "next";

const DEFAULT_BASE_URL = "https://antarious.com";

export const getSiteUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envUrl) {
    return DEFAULT_BASE_URL;
  }

  return envUrl.replace(/\/+$/, "");
};

export const buildAbsoluteUrl = (route: string): string => {
  const siteUrl = getSiteUrl();
  if (route === "/") {
    return siteUrl;
  }
  return `${siteUrl}${route}`;
};

export const buildPageMetadata = ({
  route,
  title,
  description,
}: {
  route: string;
  title: string;
  description?: string;
}): Metadata => {
  const absoluteUrl = buildAbsoluteUrl(route);
  const defaultOgImage = buildAbsoluteUrl("/assets/logos/antarious-main-header.png");
  const resolvedDescription = description?.trim() || "Antarious AI platform";
  const metadata: Metadata = {
    title,
    description: resolvedDescription,
    alternates: { canonical: absoluteUrl },
    openGraph: {
      title,
      description: resolvedDescription,
      type: "website",
      url: absoluteUrl,
      siteName: "Antarious",
      images: [
        {
          url: defaultOgImage,
          alt: "Antarious",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resolvedDescription,
      images: [defaultOgImage],
    },
  };

  return metadata;
};
