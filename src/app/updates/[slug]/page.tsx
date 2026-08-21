import { notFound } from "next/navigation";

import { HeroBanner } from "@/components/layout";
import { Section } from "@/components/ui";
import { getPerson, getPillar, getPost, getPosts } from "@/lib/content";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps<"/updates/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Byline looked up from `people` — a post never retypes an author's
  // credentials (architecture doc §5.4).
  const author = post.author ? getPerson(post.author) : undefined;
  const pillar = getPillar(post.pillar);

  return (
    <>
      <HeroBanner
        title={post.title}
        subtitle={post.excerpt}
        image={post.cover_image || undefined}
      />

      <Section>
        <p>
          {pillar?.name}
          {author ? ` · ${author.name}, ${author.title}` : null}
          {` · ${post.date}`}
        </p>

        {/* TODO: <PostBody> — render Markdown — then <ShareBar>. */}
        <div>{post.body}</div>
      </Section>
    </>
  );
}
