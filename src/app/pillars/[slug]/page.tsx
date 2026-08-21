import Link from "next/link";
import { notFound } from "next/navigation";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import {
  getPillar,
  getPillars,
  getPostsByPillar,
  type PillarId,
} from "@/lib/content";

export function generateStaticParams() {
  return getPillars().map((pillar) => ({ slug: pillar.id }));
}

export default async function PillarPage({
  params,
}: PageProps<"/pillars/[slug]">) {
  const { slug } = await params;
  const pillar = getPillar(slug as PillarId);
  if (!pillar) notFound();

  // Replaces the old static "Updates" columns — this list fills itself as posts
  // get tagged with this pillar.
  const posts = getPostsByPillar(pillar.id);

  return (
    <>
      <HeroBanner title={pillar.name} subtitle={pillar.short_description} />

      <Section intro={pillar.long_description || undefined} />

      <Section title="Related updates" tone="surface">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/updates/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No published posts under this pillar yet.</p>
        )}
      </Section>
    </>
  );
}
