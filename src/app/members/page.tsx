import type { Metadata } from "next";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getOrgProfile, getPeopleByRole } from "@/lib/content";

export const metadata: Metadata = { title: "Members" };

/** Three sections rendered from one `people` collection, filtered by role —
 *  not three copy-pasted blocks (architecture doc §3.3). */
const GROUPS = [
  { id: "advisory-council", title: "Advisory Council", role: "advisory_council" },
  { id: "core-leadership", title: "Core Leadership", role: "core_leadership" },
  { id: "committees", title: "Committees", role: "committee_member" },
] as const;

export default function MembersPage() {
  const org = getOrgProfile();

  return (
    <>
      <HeroBanner title="Members" subtitle={org.members_intro} />

      {GROUPS.map((group, index) => {
        const people = getPeopleByRole(group.role);

        return (
          <Section
            key={group.id}
            id={group.id}
            title={group.title}
            tone={index % 2 === 1 ? "surface" : "default"}
          >
            {/* TODO: <PersonGrid> / <PersonCard>. */}
            {people.length > 0 ? (
              <ul>
                {people.map((person) => (
                  <li key={person.id}>
                    <strong>{person.name}</strong> — {person.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>To be supplied soon.</p>
            )}
          </Section>
        );
      })}
    </>
  );
}
