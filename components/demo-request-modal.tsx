"use client";

import { usePathname } from "next/navigation";
import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";

const TRIGGER_SELECTORS = [
  ".btn-nav-cta",
  ".nav-cta",
  ".btn-cta-p",
  ".btn-hero-p",
  ".btn-primary",
  ".btn.btn-p",
  ".button-primary",
  'a[href*="Request%20a%20Demo"]',
];

const getTriggerSelector = () => TRIGGER_SELECTORS.join(", ");

type DemoTrack = "business" | "government" | "ngo";

type TrackContent = {
  label: string;
  eyebrow: string;
  heading: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  teamSizeLabel: string;
  focusLabel: string;
  focusPlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successDetail: string;
  brandColor: string;
  brandWarm: string;
  brandGlow: string;
};

const TRACK_CONTENT: Record<DemoTrack, TrackContent> = {
  business: {
    label: "Business",
    eyebrow: "Business · demo request",
    heading: "See Freya in your revenue workflow",
    description: "Share your GTM context and we will tailor a guided demo around your team, process, and growth priorities.",
    nameLabel: "Full name",
    namePlaceholder: "Jane Smith",
    emailLabel: "Work email",
    emailPlaceholder: "jane@company.com",
    organizationLabel: "Company",
    organizationPlaceholder: "Company or brand name",
    teamSizeLabel: "Company size",
    focusLabel: "What should the demo focus on for your business team?",
    focusPlaceholder: "Tell us the workflows or bottlenecks you want to improve…",
    submitLabel: "Submit business request",
    successTitle: "Thanks — your business demo request is in.",
    successDetail: "Our team will reply shortly with suggested times for a walkthrough tailored to your GTM motion.",
    brandColor: "#0B74D8",
    brandWarm: "#38BDF8",
    brandGlow: "rgba(11, 116, 216, 0.32)",
  },
  government: {
    label: "Government",
    eyebrow: "Government · demo request",
    heading: "See Freya in your department workflow",
    description:
      "Share your policy and service delivery context and we will tailor a guided demo for your governance, approvals, and reporting needs.",
    nameLabel: "Full name",
    namePlaceholder: "As on official correspondence",
    emailLabel: "Official email",
    emailPlaceholder: "name@agency.gov",
    organizationLabel: "Department or agency",
    organizationPlaceholder: "e.g. ministry, department, or programme office",
    teamSizeLabel: "Team or unit size",
    focusLabel: "What should the demo focus on for your department?",
    focusPlaceholder: "Tell us the services, programmes, or reporting outcomes you want to cover…",
    submitLabel: "Submit government request",
    successTitle: "Thanks — your government demo request is in.",
    successDetail: "We will follow up on your official email with next steps and available briefing slots.",
    brandColor: "#7A1F5C",
    brandWarm: "#A855F7",
    brandGlow: "rgba(122, 31, 92, 0.34)",
  },
  ngo: {
    label: "NGO",
    eyebrow: "NGO · demo request",
    heading: "See Freya in your programme workflow",
    description:
      "Share your programme and donor context and we will tailor a guided demo around your team, field operations, and reporting priorities.",
    nameLabel: "Full name",
    namePlaceholder: "Your name",
    emailLabel: "Work email",
    emailPlaceholder: "you@organisation.org",
    organizationLabel: "Organisation",
    organizationPlaceholder: "Organisation or programme name",
    teamSizeLabel: "Programme team size",
    focusLabel: "What should the demo focus on for your NGO team?",
    focusPlaceholder: "Tell us your programme workflows, donors, or field realities you want the walkthrough to address…",
    submitLabel: "Submit NGO request",
    successTitle: "Thanks — your NGO demo request is in.",
    successDetail: "We will reach out shortly to align the session with your programme and reporting needs.",
    brandColor: "#138A4A",
    brandWarm: "#34D399",
    brandGlow: "rgba(19, 138, 74, 0.3)",
  },
};

const getTrackFromPathname = (pathname: string | null): DemoTrack | null => {
  if (!pathname) {
    return null;
  }
  if (pathname.startsWith("/government")) {
    return "government";
  }
  if (pathname.startsWith("/ngo")) {
    return "ngo";
  }
  if (pathname.startsWith("/business")) {
    return "business";
  }
  return null;
};

const getDefaultTrackFromPage = (): DemoTrack => {
  if (typeof document === "undefined") {
    return "business";
  }

  const main = document.querySelector("main");
  const className = main?.className ?? "";
  if (className.includes("page-government")) {
    return "government";
  }
  if (className.includes("page-ngo")) {
    return "ngo";
  }
  return "business";
};

const isDemoAction = (element: Element): boolean => {
  const text = (element.textContent ?? "").toLowerCase();
  const hasRequest = text.includes("request");
  const hasDemo = text.includes("demo");
  const hasBriefing = text.includes("briefing");
  return text.includes("request demo") || text.includes("request a demo") || text.includes("request briefing") || (hasRequest && (hasDemo || hasBriefing));
};

export default function DemoRequestModal() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<DemoTrack>("business");
  const triggerSelector = useMemo(() => getTriggerSelector(), []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) {
        return;
      }

      const trigger = target.closest(triggerSelector);
      if (!trigger || !isDemoAction(trigger)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      setSubmitted(false);
      setSelectedTrack(getTrackFromPathname(pathnameRef.current) ?? getDefaultTrackFromPage());
      setOpen(true);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onEscape);
    };
  }, [triggerSelector]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const content = TRACK_CONTENT[selectedTrack];

  if (!open) {
    return null;
  }

  return (
    <div className="demo-modal-backdrop" onClick={() => setOpen(false)}>
      <div
        className="demo-modal-card"
        style={
          {
            "--brand": content.brandColor,
            "--brand-warm": content.brandWarm,
            "--brand-glow": content.brandGlow,
          } as CSSProperties
        }
        onClick={(event) => event.stopPropagation()}
      >
        <button className="demo-modal-close" type="button" aria-label="Close form" onClick={() => setOpen(false)}>
          ✕
        </button>
        <div className="demo-modal-eyebrow">{content.eyebrow}</div>
        <h3>{content.heading}</h3>
        <p>{content.description}</p>
        <div className="demo-modal-track" role="radiogroup" aria-label="Use case track">
          <button
            type="button"
            className={selectedTrack === "business" ? "is-selected" : ""}
            onClick={() => setSelectedTrack("business")}
          >
            {TRACK_CONTENT.business.label}
          </button>
          <button
            type="button"
            className={selectedTrack === "government" ? "is-selected" : ""}
            onClick={() => setSelectedTrack("government")}
          >
            {TRACK_CONTENT.government.label}
          </button>
          <button type="button" className={selectedTrack === "ngo" ? "is-selected" : ""} onClick={() => setSelectedTrack("ngo")}>
            {TRACK_CONTENT.ngo.label}
          </button>
        </div>
        {submitted ? (
          <div className="demo-modal-success">
            <strong>{content.successTitle}</strong>
            <span>{content.successDetail}</span>
          </div>
        ) : (
          <form className="demo-modal-form" onSubmit={onSubmit}>
            <div className="demo-modal-grid">
              <label>
                {content.nameLabel}
                <input type="text" name="name" placeholder={content.namePlaceholder} required />
              </label>
              <label>
                {content.emailLabel}
                <input type="email" name="email" placeholder={content.emailPlaceholder} required />
              </label>
            </div>
            <div className="demo-modal-grid">
              <label style={selectedTrack === "government" ? { gridColumn: "1 / -1" } : undefined}>
                {content.organizationLabel}
                <input type="text" name="organization" placeholder={content.organizationPlaceholder} required />
              </label>
              {selectedTrack !== "government" ? (
                <label>
                  {content.teamSizeLabel}
                  <select name="teamSize" defaultValue="11-50" required>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-1000">201-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </label>
              ) : null}
            </div>
            <input type="hidden" name="track" value={selectedTrack} />
            <label>
              {content.focusLabel}
              <textarea name="message" placeholder={content.focusPlaceholder} rows={4} />
            </label>
            <button type="submit">{content.submitLabel}</button>
          </form>
        )}
      </div>
    </div>
  );
}
