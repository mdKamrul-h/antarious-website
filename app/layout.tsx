import type { Metadata } from "next";
import DemoRequestModal from "@/components/demo-request-modal";
import ThemeController from "@/components/theme-controller";
import { getSiteUrl } from "@/lib/seo";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Antarious AI", template: "%s | Antarious" },
  description:
    "Antarious AI — the agentic operating system for enterprise, government, and NGO operations. Human approval, audit trails, sector-ready agents.",
  metadataBase: new URL(getSiteUrl()),
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const themeBootScript = `
    (function () {
      try {
        localStorage.setItem("antarious-theme", "light");
      } catch (e) {}
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    })();
  `;

  return (
    <html lang="en" className="h-full antialiased" data-theme="light" suppressHydrationWarning>
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <ThemeController />
        <DemoRequestModal />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
