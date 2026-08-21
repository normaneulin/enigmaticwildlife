import type { Metadata } from "next";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getOrgProfile } from "@/lib/content";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  const org = getOrgProfile();

  return (
    <>
      <HeroBanner title="About Us" subtitle={org.definition} />

      <Section id="definition" title="Definition" intro={org.definition} />

      <Section id="vision-mission" title="Vision &amp; Mission" tone="surface">
        <h3>Vision</h3>
        <p>{org.vision}</p>
        <h3>Mission</h3>
        <p>{org.mission}</p>
      </Section>

      <Section id="advocacy" title="Advocacy" intro={org.advocacy_statement} />

      {/* The canonical history. Home links here rather than repeating it. */}
      <Section id="history" title="How We Started" tone="surface">
        {/* TODO: render through a Markdown pipeline once one is added. */}
        {org.history
          .trim()
          .split(/\n{2,}/)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </Section>
    </>
  );
}
