import fs from "node:fs/promises";
import path from "node:path";

import { getRouteByFileName } from "@/lib/page-map";

type LegacyMetadata = {
  title: string;
  description?: string;
};

export type LegacyHtmlPage = {
  bodyHtml: string;
  bodyClassName?: string;
  styles: string[];
  scripts: string[];
  metadata: LegacyMetadata;
};

const LEGACY_SOURCE_DIR = path.join(process.cwd(), "legacy-source");

const extractMatch = (input: string, pattern: RegExp): string | undefined => {
  const match = input.match(pattern);
  return match?.[1]?.trim();
};

const collectMatches = (input: string, pattern: RegExp): string[] => {
  return [...input.matchAll(pattern)].map((match) => match[1]).filter(Boolean);
};

const isExternalOrSpecialPath = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("//") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:") ||
    normalized.startsWith("javascript:") ||
    normalized.startsWith("#")
  );
};

const normalizeAssetPath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  if (!trimmed || isExternalOrSpecialPath(trimmed) || trimmed.startsWith("/")) {
    return rawPath;
  }

  const [pathPart, suffix = ""] = trimmed.split(/([?#].*)/, 2);
  const normalizedPath = pathPart.replace(/^\.?\//, "");

  // Keep route rewriting separate; only asset-like paths should become root-relative.
  if (normalizedPath.toLowerCase().endsWith(".html")) {
    return rawPath;
  }

  const assetLikePrefixes = ["assets/", "_next/", "favicon", "logo"];
  const assetLikeExtensions = /\.(png|jpe?g|gif|webp|svg|ico|mp4|webm|css|js|woff2?|ttf|otf)$/i;
  const isAssetLike =
    assetLikePrefixes.some((prefix) => normalizedPath.toLowerCase().startsWith(prefix)) ||
    assetLikeExtensions.test(normalizedPath);

  if (!isAssetLike) {
    return rawPath;
  }

  return `/${normalizedPath}${suffix}`;
};

const normalizeLegacyHref = (hrefValue: string): string => {
  const trimmed = hrefValue.trim();
  if (!trimmed) {
    return hrefValue;
  }

  const hashIndex = trimmed.indexOf("#");
  const queryIndex = trimmed.indexOf("?");

  const endOfPath =
    queryIndex === -1
      ? hashIndex === -1
        ? trimmed.length
        : hashIndex
      : hashIndex === -1
        ? queryIndex
        : Math.min(queryIndex, hashIndex);

  const pathPart = trimmed.slice(0, endOfPath);
  const suffix = trimmed.slice(endOfPath);
  const normalizedPath = pathPart.replace(/^\.?\//, "").toLowerCase();

  if (!normalizedPath.endsWith(".html")) {
    return hrefValue;
  }

  const route = getRouteByFileName(normalizedPath);
  if (!route) {
    return hrefValue;
  }

  return `${route}${suffix}`;
};

const rewriteLegacyHtmlLinks = (input: string): string =>
  input.replace(/href=(["'])([^"']+)\1/gi, (fullMatch, quote: string, hrefValue: string) => {
    const rewritten = normalizeLegacyHref(hrefValue);
    return `href=${quote}${rewritten}${quote}`;
  });

const rewriteLegacyAssetAttributes = (input: string): string =>
  input.replace(
    /(src|poster)=((["'])([^"']+)\3)/gi,
    (fullMatch, attrName: string, _quotedValue: string, quote: string, pathValue: string) => {
      const rewritten = normalizeAssetPath(pathValue);
      return `${attrName}=${quote}${rewritten}${quote}`;
    },
  );

const rewriteLegacyBodyQuotedPaths = (input: string): string => {
  return input.replace(
    /(["'`])((?:\.\/)?[a-z0-9-]+(?:-[a-z0-9-]+)*\.html(?:\?[^"'`#]*)?(?:#[^"'`]*)?)\1/gi,
    (fullMatch, quote: string, filePath: string) => {
      const rewritten = normalizeLegacyHref(filePath);
      return `${quote}${rewritten}${quote}`;
    },
  );
};

const rewriteLegacyCssAssetUrls = (input: string): string =>
  input.replace(/url\((['"]?)([^)'"]+)\1\)/gi, (fullMatch, quote: string, rawPath: string) => {
    const rewritten = normalizeAssetPath(rawPath);
    return `url(${quote}${rewritten}${quote})`;
  });

const rewriteLegacyScriptPaths = (input: string): string => {
  const withRoutePaths = input.replace(
    /(["'`])([a-z0-9-]+(?:-[a-z0-9-]+)*\.html(?:#[^"'`]+)?)\1/gi,
    (fullMatch, quote: string, filePath: string) => {
      const rewritten = normalizeLegacyHref(filePath);
      return `${quote}${rewritten}${quote}`;
    },
  );

  return withRoutePaths.replace(
    /(["'`])((?:\.\/)?(?:assets\/|_next\/)[^"'`]+)\1/gi,
    (fullMatch, quote: string, assetPath: string) => {
      const rewritten = normalizeAssetPath(assetPath);
      return `${quote}${rewritten}${quote}`;
    },
  );
};

const stripInlineScriptTags = (input: string): string =>
  input.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

const extractBodyClassName = (input: string): string | undefined => {
  const bodyOpenTag = input.match(/<body\b([^>]*)>/i)?.[1];
  if (!bodyOpenTag) {
    return undefined;
  }

  const classMatch = bodyOpenTag.match(/class=(["'])(.*?)\1/i)?.[2]?.trim();
  return classMatch ? classMatch : undefined;
};

export async function loadLegacyHtml(fileName: string): Promise<LegacyHtmlPage> {
  const filePath = path.join(LEGACY_SOURCE_DIR, fileName);
  const html = await fs.readFile(filePath, "utf8");

  const bodyClassName = extractBodyClassName(html);
  const rawBodyHtml = extractMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i) ?? html;
  const bodyHtml = rewriteLegacyBodyQuotedPaths(
    rewriteLegacyAssetAttributes(rewriteLegacyHtmlLinks(stripInlineScriptTags(rawBodyHtml))),
  );
  const title = extractMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? "Antarious";
  const description = extractMatch(
    html,
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i,
  );

  // Keep embedded style/script behavior from the original pages.
  const styles = collectMatches(html, /<style[^>]*>([\s\S]*?)<\/style>/gi).map((style) =>
    rewriteLegacyCssAssetUrls(style),
  );
  const scripts = collectMatches(html, /<script[^>]*>([\s\S]*?)<\/script>/gi).map((script) =>
    rewriteLegacyScriptPaths(script),
  );

  return {
    bodyHtml,
    bodyClassName,
    styles,
    scripts,
    metadata: { title, description },
  };
}
