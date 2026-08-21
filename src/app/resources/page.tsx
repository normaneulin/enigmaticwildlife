import type { Metadata } from "next";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getLearningResourcesByCategory, getOrgProfile } from "@/lib/content";

export const metadata: Metadata = { title: "Learning Resource Materials" };

const CATEGORIES = [
  {
    id: "organizational",
    title: "Organizational Documents",
    category: "organizational",
  },
  {
    id: "conservation-advocacy",
    title: "Conservation & Advocacy",
    category: "conservation_advocacy",
  },
] as const;

export default function ResourcesPage() {
  const org = getOrgProfile();

  return (
    <>
      <HeroBanner
        title="Learning Resource Materials"
        subtitle={org.resources_intro}
      />

      {CATEGORIES.map((section, index) => {
        const resources = getLearningResourcesByCategory(section.category);

        return (
          <Section
            key={section.id}
            id={section.id}
            title={section.title}
            tone={index % 2 === 1 ? "surface" : "default"}
          >
            {/* TODO: <LRMList> — download links and status badges. */}
            <ul>
              {resources.map((resource) => (
                <li key={resource.slug}>
                  {resource.title}
                  {resource.status !== "published"
                    ? ` (${resource.status.replace("_", " ")})`
                    : null}
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
    </>
  );
}
