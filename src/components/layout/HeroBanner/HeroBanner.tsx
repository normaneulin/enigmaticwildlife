import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { HeroSlideshow } from "./HeroSlideshow";
import styles from "./HeroBanner.module.css";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  /** Small label above the title — who is speaking, not what the page is. */
  eyebrow?: string;
  /** Path under /public. Omit for a solid brand-green band. */
  image?: string;
  /** Two or more paths under /public, cross-faded on a timer. Wins over `image`. */
  images?: string[];
  /** `full` for the Home hero; `page` for top-level page headers. */
  size?: "full" | "page";
  primaryCta?: {
    label: string;
    url: string;
    external?: boolean;
  };
  children?: ReactNode;
}

/**
 * Every page's top block. It also does structural work: the header is fixed and
 * transparent at scroll 0, so its white logo and links need a dark surface
 * underneath. This component always supplies one — a photo with a scrim, or a
 * solid green band — and reserves the header's height so nothing hides beneath
 * it. A page without a HeroBanner will have content slide under the header.
 */
export function HeroBanner({
  title,
  subtitle,
  eyebrow,
  image,
  images,
  size = "page",
  primaryCta,
  children,
}: HeroBannerProps) {
  // A single photo stays a plain server-rendered <Image>; only a real sequence
  // is worth shipping the client component for.
  const slides = images?.length ? images : image ? [image] : [];
  // The scrim is tuned for photography. Over the solid green band it would only
  // muddy the brand colour, so it is opt-in on the image.
  const hasImage = slides.length > 0;
  const CtaIcon = primaryCta?.external ? ArrowUpRight : ArrowRight;

  return (
    <section className={styles.hero} data-size={size} data-has-image={hasImage}>
      {slides.length > 1 ? (
        <HeroSlideshow images={slides} />
      ) : slides.length === 1 ? (
        <Image
          src={slides[0]}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      ) : null}

      {/* Brand swoosh. Both files park their artwork in the bottom-right corner
          and leave the rest transparent, so they can sit full-bleed behind the
          copy without ever landing under it. The aspect ratios are declared
          here because the SVGs size themselves in percentages and so carry no
          intrinsic dimensions of their own. */}
      <img
        src="/images/hero_section/design_components/lower_desktop.svg"
        alt=""
        className={`${styles.graphic} ${styles.graphicDesktop}`}
        aria-hidden="true"
      />
      <img
        src="/images/hero_section/design_components/lower_mobile.svg"
        alt=""
        className={`${styles.graphic} ${styles.graphicMobile}`}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <div className={styles.content}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}

          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

          {primaryCta ? (
            <div className={styles.actions}>
              <a
                href={primaryCta.url}
                target={primaryCta.external ? "_blank" : undefined}
                rel={primaryCta.external ? "noopener noreferrer" : undefined}
                className={styles.primaryCta}
              >
                <span className={styles.ctaLabel}>{primaryCta.label}</span>
                <span className={styles.ctaChip} aria-hidden="true">
                  <CtaIcon className={styles.ctaIcon} size={19} strokeWidth={2.25} />
                </span>
              </a>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </section>
  );
}
