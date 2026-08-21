import type { Metadata } from "next";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getOrgProfile, getPrograms } from "@/lib/content";

export const metadata: Metadata = { title: "Programs" };

export default function ProgramsPage() {
  const org = getOrgProfile();
  const programs = getPrograms();

  return (
    <>
      <HeroBanner title="Programs" subtitle={org.programs_intro} />

      {/* TODO: <ProgramGrid> with status/pillar filters. Whether programs need
          individual detail pages is still open (§8.6) — only two exist today. */}
      <Section>
        <ul>
          {programs.map((program) => (
            <li key={program.slug}>
              <strong>{program.title}</strong> — {program.status}
              <p>{program.summary}</p>
              {program.partner_org ? <p>With {program.partner_org}</p> : null}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
