"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type PageMotionPreset = {
  rootClassName: string;
  heroSelectors: string[];
  sectionSelectors: string[];
  cardSelectors: string[];
};

const PAGE_MOTION_PRESETS: Record<string, PageMotionPreset> = {
  "/": {
    rootClassName: "",
    heroSelectors: [".hero-wrap", ".hero", ".hero-inner", ".hero-grid", ".split-hero"],
    sectionSelectors: ["section", ".trust-strip", ".page-main > *", ".site-footer"],
    cardSelectors: [".feature-card", ".metric-card", ".workflow-card", ".surface", ".panel", ".quote-card"],
  },
  "/business": {
    rootClassName: "page-business",
    heroSelectors: [".hero-wrap", ".hero-inner", ".terminal"],
    sectionSelectors: ["section", ".trust-strip", ".divider", "footer"],
    cardSelectors: [".ag", ".cc", ".ba-col", ".ws", ".psych-card", ".cta-card"],
  },
  "/government": {
    rootClassName: "page-government",
    heroSelectors: [".hero-wrap", ".hero-inner", ".terminal"],
    sectionSelectors: ["section", ".trust-strip", ".divider", "footer"],
    cardSelectors: [".ag", ".cc", ".ba-col", ".ws", ".bridge-grid", ".cta-card"],
  },
  "/ngo": {
    rootClassName: "page-ngo",
    heroSelectors: [".hero-wrap", ".hero-inner", ".terminal"],
    sectionSelectors: ["section", ".trust-strip", ".divider", "footer"],
    cardSelectors: [".ag", ".cc", ".uc-panel", ".ws", ".bridge-grid", ".psych-card", ".cta-card"],
  },
  "/freya": {
    rootClassName: "page-freya",
    heroSelectors: [".hero-wrap", ".hero-inner", ".terminal"],
    sectionSelectors: ["section", ".trust-strip", ".divider", "footer"],
    cardSelectors: [".ag", ".feature", ".panel", ".ws", ".stack-card", ".cta-card"],
  },
};

const getScreenType = (width: number): "mobile" | "tablet" | "desktop" => {
  if (width < 768) {
    return "mobile";
  }

  if (width < 1120) {
    return "tablet";
  }

  return "desktop";
};

const routeToPreset = (pathname: string): PageMotionPreset => {
  if (PAGE_MOTION_PRESETS[pathname]) {
    return PAGE_MOTION_PRESETS[pathname];
  }

  return {
    rootClassName: "",
    heroSelectors: [".hero-wrap", ".hero", ".hero-inner"],
    sectionSelectors: ["section", ".page-main > *", "footer"],
    cardSelectors: [".feature-card", ".metric-card", ".workflow-card", ".surface", ".panel"],
  };
};

const queryUnique = (root: Element, selectors: string[]): Element[] => {
  const unique = new Set<Element>();
  selectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((node) => unique.add(node));
  });
  return [...unique];
};

export default function PageMotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const preset = routeToPreset(pathname);
    const explicitRoot =
      preset.rootClassName.trim().length > 0
        ? document.querySelector(`main.${preset.rootClassName}`)
        : null;
    const root =
      explicitRoot ??
      document.querySelector("main.page-business, main.page-government, main.page-ngo, main.page-freya") ??
      document.querySelector("main");

    if (!root) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateScreenMode = () => {
      root.setAttribute("data-screen", getScreenType(window.innerWidth));
      root.setAttribute("data-reduced-motion", mediaQuery.matches ? "true" : "false");
    };

    updateScreenMode();
    window.addEventListener("resize", updateScreenMode);
    mediaQuery.addEventListener("change", updateScreenMode);

    const heroNodes = queryUnique(root, preset.heroSelectors);
    const sectionNodes = queryUnique(root, preset.sectionSelectors);
    const cardNodes = queryUnique(root, preset.cardSelectors);

    heroNodes.forEach((node, index) => {
      const delay = index * 40;
      node.setAttribute("data-motion", "hero");
      (node as HTMLElement).style.setProperty("--motion-delay", String(delay));
    });

    sectionNodes.forEach((node, index) => {
      const delay = (index % 6) * 50;
      node.setAttribute("data-motion", "section");
      (node as HTMLElement).style.setProperty("--motion-delay", String(delay));
    });

    cardNodes.forEach((node, index) => {
      const delay = (index % 8) * 35;
      node.setAttribute("data-motion", "card");
      (node as HTMLElement).style.setProperty("--motion-delay", String(delay));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.motionVisible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: mediaQuery.matches ? 0 : 0.12,
        rootMargin: mediaQuery.matches ? "0px" : "0px 0px -8% 0px",
      },
    );

    queryUnique(root, ['[data-motion="hero"]', '[data-motion="section"]', '[data-motion="card"]']).forEach(
      (node) => observer.observe(node),
    );

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScreenMode);
      mediaQuery.removeEventListener("change", updateScreenMode);
    };
  }, [pathname]);

  return null;
}
