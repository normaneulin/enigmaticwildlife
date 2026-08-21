/**
 * Filesystem loaders for the `content/` collections.
 *
 * SERVER ONLY. These use `node:fs`, so they may only be called from Server
 * Components, `generateStaticParams`, or Route Handlers — never from a file
 * carrying "use client". Every page is a *view* over this data; no page should
 * ever retype content that lives here.
 */

import fs from "node:fs";
import path from "node:path";
// js-yaml v5 is ESM-only with named exports — there is no default export.
import { load as loadYaml } from "js-yaml";
import matter from "gray-matter";

import type {
  LearningResource,
  OrgProfile,
  Person,
  Pillar,
  PillarId,
  Post,
  Program,
  SiteSettings,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readYaml<T>(...segments: string[]): T {
  const file = path.join(CONTENT_DIR, ...segments);
  return loadYaml(fs.readFileSync(file, "utf8")) as T;
}

/**
 * Every `.yaml` file in a collection folder, skipping `_`-prefixed files so
 * template/placeholder records never reach the live site.
 */
function readYamlCollection<T>(collection: string): T[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => /\.ya?ml$/.test(name) && !name.startsWith("_"))
    .map((name) => readYaml<T>(collection, name));
}

export function getSiteSettings(): SiteSettings {
  return readYaml<SiteSettings>("settings", "site.yaml");
}

export function getOrgProfile(): OrgProfile {
  return readYaml<OrgProfile>("org", "profile.yaml");
}

export function getPillars(): Pillar[] {
  return readYamlCollection<Pillar>("pillars").sort((a, b) => a.order - b.order);
}

export function getPillar(id: PillarId): Pillar | undefined {
  return getPillars().find((pillar) => pillar.id === id);
}

export function getPeople(): Person[] {
  return readYamlCollection<Person>("people").sort((a, b) => a.order - b.order);
}

export function getPeopleByRole(role: Person["role"]): Person[] {
  return getPeople().filter((person) => person.role === role);
}

/** Byline lookup, so a post never has to retype an author's credentials. */
export function getPerson(id: string): Person | undefined {
  return getPeople().find((person) => person.id === id);
}

export function getPrograms(): Program[] {
  return readYamlCollection<Program>("programs");
}

export function getProgram(slug: string): Program | undefined {
  return getPrograms().find((program) => program.slug === slug);
}

export function getLearningResources(): LearningResource[] {
  return readYamlCollection<LearningResource>("resources").sort(
    (a, b) => a.order - b.order,
  );
}

export function getLearningResourcesByCategory(
  category: LearningResource["category"],
): LearningResource[] {
  return getLearningResources().filter(
    (resource) => resource.category === category,
  );
}

/**
 * Published posts, newest first. Drafts and `_`-prefixed templates are excluded
 * — the blog index, the Home teaser, and each pillar page all read from here.
 */
export function getPosts(): Post[] {
  const dir = path.join(CONTENT_DIR, "posts");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .map((name) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(dir, name), "utf8"),
      );
      return {
        ...data,
        // gray-matter parses unquoted YAML dates into Date objects; normalize to
        // an ISO date string so this stays serializable across the RSC boundary.
        date:
          data.date instanceof Date
            ? data.date.toISOString().slice(0, 10)
            : String(data.date),
        body: content,
      } as Post;
    })
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getPostsByPillar(pillar: PillarId): Post[] {
  return getPosts().filter((post) => post.pillar === pillar);
}

export function getLatestPosts(limit = 3): Post[] {
  return getPosts().slice(0, limit);
}

export * from "./types";
