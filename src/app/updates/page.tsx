import type { Metadata } from "next";
import Link from "next/link";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getOrgProfile, getPillars, getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Updates" };

export default function UpdatesPage() {
  const org = getOrgProfile();
  const posts = getPosts();
  const pillars = getPillars();

  return (
    <>
      <HeroBanner title="Updates" subtitle={org.updates_intro} />

      {/* TODO: <PostGrid> with pillar/tag filters and pagination. */}
      <Section>
        <ul>
          {pillars.map((pillar) => (
            <li key={pillar.id}>
              <Link href={`/pillars/${pillar.id}`}>{pillar.short_name}</Link>
            </li>
          ))}
        </ul>

        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/updates/${post.slug}`}>{post.title}</Link>
                <p>{post.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No published posts yet. The legacy Facebook updates are staged as
            drafts in <code>content/posts/</code>.
          </p>
        )}
      </Section>
    </>
  );
}
