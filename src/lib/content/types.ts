/**
 * Shapes of the `content/` collections. These mirror the content model in
 * .context/ENWILD_WEBSITE_ARCHITECTURE.md §3 — if a field changes here it must
 * change in public/admin/config.yml too, or the CMS will write files the site
 * can't read.
 */

export type PillarId = "pillar-1" | "pillar-2" | "pillar-3";

export interface Pillar {
  id: PillarId;
  order: number;
  name: string;
  short_name: string;
  short_description: string;
  long_description: string;
  icon: string;
  color_accent: string;
}

export interface Founder {
  name: string;
  title: string;
}

export interface Boilerplates {
  short: string;
  medium: string;
  long: string;
}

export interface OrgProfile {
  definition: string;
  vision: string;
  mission: string;
  advocacy_statement: string;
  founding_date: string;
  founders: Founder[];
  history: string;
  history_translations: { fil: string; hil: string };
  founder_quote: { text: string; attribution: string };
  boilerplates: Boilerplates;
  pillars_intro: string;
  pillars_outro: string;
  programs_intro: string;
  members_intro: string;
  resources_intro: string;
  updates_intro: string;
}

export type PersonRole =
  | "advisory_council"
  | "core_leadership"
  | "committee_member";

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  committee: string;
  title: string;
  bio: string;
  photo: string;
  socials: { facebook: string; instagram: string; linkedin: string };
  order: number;
}

export interface Program {
  title: string;
  slug: string;
  type: "partnership" | "internal";
  pillar: PillarId[];
  status: "ongoing" | "completed" | "upcoming";
  partner_org: string;
  summary: string;
  description: string;
  cover_image: string;
  featured: boolean;
  links: { label: string; url: string }[];
}

export interface LearningResource {
  title: string;
  slug: string;
  category: "organizational" | "conservation_advocacy";
  status: "published" | "in_refinement" | "coming_soon";
  description: string;
  file_url: string;
  order: number;
}

export interface PostFrontmatter {
  title: string;
  slug: string;
  pillar: PillarId;
  date: string;
  author: string;
  cover_image: string;
  tags: string[];
  excerpt: string;
  status: "draft" | "published";
  external_links: { facebook: string; instagram: string };
}

export interface Post extends PostFrontmatter {
  /** Raw Markdown body, not yet rendered to HTML. */
  body: string;
}

export interface Social {
  platform: "facebook" | "instagram" | "email";
  label: string;
  url: string;
}

export interface SiteSettings {
  name: string;
  legal_name: string;
  slogan: string;
  contact: { email: string; location: string };
  socials: Social[];
  primary_cta: { label: string; url: string };
  qr_codes: { label: string; image: string }[];
}
