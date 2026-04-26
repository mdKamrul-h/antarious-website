const stripTags = (value: string): string =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type FaqItem = {
  question: string;
  answer: string;
};

export const extractFaqItemsFromBodyHtml = (bodyHtml: string): FaqItem[] => {
  const items: FaqItem[] = [];
  const pattern =
    /<p[^>]*class=["']callout-line["'][^>]*>\s*<strong>\s*Q:\s*([\s\S]*?)<\/strong>\s*<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;

  for (const match of bodyHtml.matchAll(pattern)) {
    const question = stripTags(match[1] ?? "");
    const answer = stripTags(match[2] ?? "");

    if (!question || !answer) {
      continue;
    }

    items.push({ question, answer });
  }

  return items;
};

export const buildFaqSchema = (faqItems: FaqItem[]) => {
  if (!faqItems.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};
