import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getRouteFromHtmlPath } from "@/lib/page-map";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.endsWith(".html")) {
    return NextResponse.next();
  }

  const route = getRouteFromHtmlPath(pathname);
  if (!route) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(route, request.url);
  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
