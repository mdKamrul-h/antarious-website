export type LegacyPage = {
  route: string;
  file: string;
};

export const LEGACY_PAGES: LegacyPage[] = [
  { route: "/", file: "index.html" },
  { route: "/business", file: "business.html" },
  { route: "/government", file: "government.html" },
  { route: "/ngo", file: "ngo.html" },
  { route: "/freya", file: "freya.html" },
  { route: "/faq/comprehensive", file: "faq-comprehensive.html" },
  { route: "/trust/human-approval", file: "trust-human-approval.html" },
  { route: "/trust/audit-trail", file: "trust-audit-trail.html" },
  { route: "/trust/role-based-control", file: "trust-role-based-control.html" },
  { route: "/trust/security", file: "trust-security.html" },
  { route: "/company/about", file: "company-about.html" },
  { route: "/company/contact", file: "company-contact.html" },
  { route: "/company/partnerships", file: "company-partnerships.html" },
  { route: "/company/legal", file: "company-legal.html" },
  { route: "/resources/documentation", file: "resources-documentation.html" },
  { route: "/resources/help-center", file: "resources-help-center.html" },
  { route: "/resources/webinars", file: "resources-webinars.html" },
  { route: "/resources/partner-programme", file: "resources-partner-programme.html" },
];

export const getLegacyPageByRoute = (route: string): LegacyPage | undefined =>
  LEGACY_PAGES.find((page) => page.route === route);

export const getLegacyPageByFile = (file: string): LegacyPage | undefined =>
  LEGACY_PAGES.find((page) => page.file === file);

export const getRouteByFileName = (fileName: string): string | undefined =>
  getLegacyPageByFile(fileName)?.route;

export const getRouteFromHtmlPath = (pathname: string): string | undefined => {
  const normalized = pathname.toLowerCase();
  if (normalized === "/index.html") {
    return "/";
  }

  const fileName = normalized.replace(/^\//, "");
  const page = getLegacyPageByFile(fileName);
  return page?.route;
};
