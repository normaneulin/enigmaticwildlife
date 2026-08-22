import Link from "next/link";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import {
  getLatestPosts,
  getOrgProfile,
  getPillars,
  getPrograms,
  getSiteSettings,
} from "@/lib/content";

/**
 * Cross-faded behind the home hero, in this order. Listed rather than globbed so
 * the sequence is reviewable and adding a file to the folder is not silently a
 * publishing action.
 */
const HERO_IMAGES = [
  "/images/hero_section/series/landscape1.webp",
  "/images/hero_section/series/landscape2.webp",
  "/images/hero_section/series/landscape3.webp",
  "/images/hero_section/series/landscape4.webp",
  "/images/hero_section/series/landscape5.webp",
];

/**
 * Home is all teasers. Per the architecture doc §6.1 it must never hold the full
 * version of anything — every block links out to the page that owns the content.
 */
export default function HomePage() {
  const site = getSiteSettings();
  const org = getOrgProfile();
  const pillars = getPillars();
  const posts = getLatestPosts(3);
  const featured = getPrograms().filter((program) => program.featured);

  return (
    <>
      {/* 1. Hero */}
      <HeroBanner
        size="full"
        eyebrow={site.legal_name}
        title={site.slogan}
        subtitle={org.definition}
        images={HERO_IMAGES}
        primaryCta={{
          label: site.primary_cta.label,
          url: site.primary_cta.url,
          external: true,
        }}
      />

      {/* 2. About teaser — the ~35-word boilerplate, not new copy. */}
      <Section title="Who we are" intro={org.boilerplates.short || org.definition}>
        <Link href="/about">Learn more about us &rarr;</Link>
      </Section>

      {/* 3. Founder quote — TODO: <QuoteBlock> once the quote is supplied. */}

      {/* 4. Pillars — summary cards only, never the full paragraphs. */}
      <Section title="Our three pillars" intro={org.pillars_intro} tone="surface">
        <ul>
          {pillars.map((pillar) => (
            <li key={pillar.id}>
              <Link href={`/pillars/${pillar.id}`}>{pillar.name}</Link>
              <p>{pillar.short_description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Latest Updates — 3 most recent across all pillars. */}
      <Section title="Latest updates">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/updates/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No published posts yet.</p>
        )}
        <Link href="/updates">See all updates &rarr;</Link>
      </Section>

      {/* 6. Featured programs. */}
      <Section title="Programs" tone="surface">
        <ul>
          {featured.map((program) => (
            <li key={program.slug}>
              <strong>{program.title}</strong>
              <p>{program.summary}</p>
            </li>
          ))}
        </ul>
        <Link href="/programs">All programs &rarr;</Link>
      </Section>

      {/* 7. Get-involved CTA band lives in <SiteFooter>. */}
    </>
  );
}
