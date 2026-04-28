import { getSiteUrl } from "@/lib/seo";

export const getOrganizationSchema = () => {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Antarious",
    legalName: "Antarious AI Limited",
    url: siteUrl,
    logo: `${siteUrl}/assets/logos/antarious-main-header.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@antarious.com",
        areaServed: "Worldwide",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@antarious.com",
      },
    ],
  };
};

export const getFreyaProductSchema = () => {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Freya",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Freya is the autonomous orchestration layer of Antarious AI — specialist agents, human approval, and institutional memory for enterprise, government, and NGO operations.",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      url: `${siteUrl}/company/contact`,
    },
    brand: {
      "@type": "Brand",
      name: "Antarious",
    },
    url: `${siteUrl}/freya`,
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
