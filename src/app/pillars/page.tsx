import type { Metadata } from "next";
import Link from "next/link";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getOrgProfile, getPillars } from "@/lib/content";

export const metadata: Metadata = { title: "Pillars" };

export default function PillarsPage() {
  const org = getOrgProfile();
  const pillars = getPillars();

  return (
    <>
      <HeroBanner title="EnWild Pillars" subtitle={org.pillars_intro} />

      {/* TODO: <PillarDetailBlock>. Rendered from the `pillars` collection so
          Home's summary cards and these blocks can never drift apart. */}
      {pillars.map((pillar) => (
        <Section
          key={pillar.id}
          id={pillar.id}
          title={pillar.name}
          intro={pillar.long_description || pillar.short_description}
          tone={pillar.order % 2 === 0 ? "surface" : "default"}
        >
          <Link href={`/pillars/${pillar.id}`}>
            Read more and see related updates &rarr;
          </Link>
        </Section>
      ))}

      <Section intro={org.pillars_outro} tone="surface" />
    </>
  );
}
