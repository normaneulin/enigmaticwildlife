import Image from "next/image";
import Link from "next/link";

import { getOrgProfile, getSiteSettings } from "@/lib/content";
import { NAV_ITEMS } from "@/lib/navigation";
import { SocialIcon } from "./SocialIcon";
import styles from "./SiteFooter.module.css";

/**
 * Server Component — reads `content/settings/site.yaml` and the org profile
 * directly, so the slogan, socials, and boilerplate are never retyped here.
 */
export function SiteFooter() {
  const site = getSiteSettings();
  const org = getOrgProfile();
  const year = new Date().getFullYear();

  // The ~35-word boilerplate is the canonical footer blurb; until it's pasted in
  // from the brand guide, the org definition is the closest approved copy.
  const blurb = org.boilerplates.short || org.definition;

  return (
    <footer className={styles.footer}>
      <div className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <p className={styles.ctaText}>
            Every advocate started by showing up. Add your voice to the alliance.
          </p>
          <a
            className={styles.ctaButton}
            href={site.primary_cta.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.primary_cta.label}
          </a>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.brand}>
          <Link href="/" aria-label={`${site.name} — home`}>
            <Image
              src="/logo/enwild_full_logo_white.png"
              alt={site.legal_name}
              width={2436}
              height={665}
              className={styles.logo}
            />
          </Link>
          {/* Locked string — see content/settings/site.yaml. */}
          <p className={styles.slogan}>{site.slogan}</p>
          <p className={styles.blurb}>{blurb}</p>
        </div>

        <nav className={styles.columns} aria-label="Footer">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} className={styles.column}>
              <Link href={item.href} className={styles.columnHeading}>
                {item.label}
              </Link>
              {item.children ? (
                <ul className={styles.columnList}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className={styles.columnLink}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>

        <div className={styles.contact} id="contact">
          <h2 className={styles.columnHeading}>Contact Us</h2>
          <p className={styles.contactLine}>
            Questions, collaborations, or wildlife sightings to share — write to us.
          </p>
          <a className={styles.email} href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
          {site.contact.location ? (
            <p className={styles.location}>{site.contact.location}</p>
          ) : null}

          <ul className={styles.socials}>
            {site.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel={
                    social.platform === "email" ? undefined : "noopener noreferrer"
                  }
                >
                  <SocialIcon platform={social.platform} />
                </a>
              </li>
            ))}
          </ul>

          {site.qr_codes.length > 0 ? (
            <ul className={styles.qrCodes}>
              {site.qr_codes.map((qr) => (
                <li key={qr.label}>
                  <Image
                    src={qr.image}
                    alt={qr.label}
                    width={88}
                    height={88}
                    className={styles.qrImage}
                  />
                  <span className={styles.qrLabel}>{qr.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={styles.legal}>
        <p>
          © {year} {site.legal_name}. A volunteer-based, youth-led advocacy group.
        </p>
        <p className={styles.legalLinks}>
          <Link href="/resources">Learning Resources</Link>
          <span aria-hidden="true">·</span>
          <Link href="/updates">Updates</Link>
        </p>
      </div>
    </footer>
  );
}
