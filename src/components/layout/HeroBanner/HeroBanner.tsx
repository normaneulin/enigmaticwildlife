import Image from "next/image";
import type { ReactNode } from "react";

import styles from "./HeroBanner.module.css";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  /** Path under /public. Omit for a solid brand-green band. */
  image?: string;
  /** `full` for the Home hero; `page` for top-level page headers. */
  size?: "full" | "page";
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
  image,
  size = "page",
  children,
}: HeroBannerProps) {
  return (
    <section className={styles.hero} data-size={size}>
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      ) : null}

      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        {children}
      </div>
    </section>
  );
}
