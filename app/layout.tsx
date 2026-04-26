import type { Metadata } from "next";
import DemoRequestModal from "@/components/demo-request-modal";
import ThemeController from "@/components/theme-controller";
import { getSiteUrl } from "@/lib/seo";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antarious",
  description: "Antarious website migration",
  metadataBase: new URL(getSiteUrl()),
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
        var storageTheme = localStorage.getItem("antarious-theme");
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        var selected = storageTheme || (prefersDark ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", selected);
      } catch (error) {
        document.documentElement.setAttribute("data-theme", "light");
      }
    })();
  `;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
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
