import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Real Match accessibility statement and how to report an issue."
};

export default function AccessibilityPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="prose">
          <p className="eyebrow">Accessibility</p>
          <h1>Accessibility statement</h1>
          <p>
            We want Real Match to be usable by everyone, including people who rely on
            assistive technology. This site is built against WCAG 2.2 AA as its working
            target.
          </p>

          <h2>What is implemented</h2>
          <ul>
            <li>Semantic landmarks, a logical heading order, and a skip-to-content link</li>
            <li>Full keyboard navigation, including the mobile menu (with focus trapping and Escape to close)</li>
            <li>Visible focus indicators throughout</li>
            <li>Labelled form fields with inline, screen-reader-announced error messages</li>
            <li>Reduced-motion support for visitors who prefer it</li>
            <li>Colour contrast checked against AA for text and interactive elements</li>
            <li>No information conveyed by colour alone</li>
          </ul>

          <h2>Known limitations</h2>
          <p>
            The site is under active development, and full assistive-technology testing
            across screen readers is still to be completed before launch. Issues found will
            be listed here honestly until they are fixed.
          </p>

          <h2>Report a problem</h2>
          <p>
            If any part of this site is difficult for you to use, we want to know. A
            contact route is published on the contact page; accessibility reports are
            treated as defects, not feedback.
          </p>
        </div>
      </div>
    </section>
  );
}
