/**
 * Static nav config for <SiteHeader> and <SiteFooter>.
 *
 * Safe to import from Client Components — unlike `lib/content`, this touches no
 * filesystem. Structure follows the sitemap in
 * .context/ENWILD_WEBSITE_ARCHITECTURE.md §6.
 */

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Rendered as a dropdown in the header and as a column in the footer. */
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Definition", href: "/about#definition" },
      { label: "Vision & Mission", href: "/about#vision-mission" },
      { label: "Advocacy", href: "/about#advocacy" },
      { label: "History", href: "/about#history" },
    ],
  },
  {
    label: "Pillars",
    href: "/pillars",
    children: [
      { label: "Underappreciated Wildlife & Habitats", href: "/pillars/pillar-1" },
      { label: "Empowered Youth for Conservation", href: "/pillars/pillar-2" },
      { label: "Participatory Environmental Action", href: "/pillars/pillar-3" },
    ],
  },
  { label: "Updates", href: "/updates" },
  { label: "Programs", href: "/programs" },
  {
    label: "Members",
    href: "/members",
    children: [
      { label: "Advisory Council", href: "/members#advisory-council" },
      { label: "Core Leadership", href: "/members#core-leadership" },
      { label: "Committees", href: "/members#committees" },
    ],
  },
  {
    // Written out in full on first contact; "LRMs" alone means nothing to a
    // first-time visitor.
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Organizational Documents", href: "/resources#organizational" },
      { label: "Conservation & Advocacy", href: "/resources#conservation-advocacy" },
    ],
  },
];
