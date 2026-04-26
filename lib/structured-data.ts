import { getSiteUrl } from "@/lib/seo";

export const getOrganizationSchema = () => {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Antarious",
    url: siteUrl,
    logo: `${siteUrl}/assets/logos/antarious-main.svg`,
  };
};

export const getWebsiteSchema = () => {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Antarious",
    url: siteUrl,
  };
};
