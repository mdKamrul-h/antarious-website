"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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

const isDemoAction = (element: Element): boolean => {
  const text = (element.textContent ?? "").toLowerCase();
  return text.includes("request demo") || text.includes("request a demo") || text.includes("request briefing");
};

export default function DemoRequestModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("business");
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
      setSelectedTrack("business");
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

  if (!open) {
    return null;
  }

  return (
    <div className="demo-modal-backdrop" onClick={() => setOpen(false)}>
      <div className="demo-modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="demo-modal-close" type="button" aria-label="Close form" onClick={() => setOpen(false)}>
          ✕
        </button>
        <div className="demo-modal-eyebrow">Antarious Demo Request</div>
        <h3>See Freya in your workflow</h3>
        <p>Share context and we will tailor a guided demo around your team, process, and priorities.</p>
        <div className="demo-modal-track" role="radiogroup" aria-label="Use case track">
          <button
            type="button"
            className={selectedTrack === "business" ? "is-selected" : ""}
            onClick={() => setSelectedTrack("business")}
          >
            Business
          </button>
          <button
            type="button"
            className={selectedTrack === "government" ? "is-selected" : ""}
            onClick={() => setSelectedTrack("government")}
          >
            Government
          </button>
          <button type="button" className={selectedTrack === "ngo" ? "is-selected" : ""} onClick={() => setSelectedTrack("ngo")}>
            NGO
          </button>
        </div>
        {submitted ? (
          <div className="demo-modal-success">
            <strong>Thanks, request received.</strong>
            <span>Our team will contact you shortly with the next available walkthrough slots.</span>
          </div>
        ) : (
          <form className="demo-modal-form" onSubmit={onSubmit}>
            <div className="demo-modal-grid">
              <label>
                Full name
                <input type="text" name="name" placeholder="Jane Smith" required />
              </label>
              <label>
                Work email
                <input type="email" name="email" placeholder="jane@company.com" required />
              </label>
            </div>
            <div className="demo-modal-grid">
              <label>
                Organization
                <input type="text" name="organization" placeholder="Organization name" required />
              </label>
              <label>
                Team size
                <select name="teamSize" defaultValue="11-50" required>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </label>
            </div>
            <input type="hidden" name="track" value={selectedTrack} />
            <label>
              What should the demo focus on?
              <textarea name="message" placeholder="Tell us the workflows or bottlenecks you want to improve..." rows={4} />
            </label>
            <button type="submit">Submit Request</button>
          </form>
        )}
      </div>
    </div>
  );
}
