"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/lib/navigation";
import styles from "./SiteHeader.module.css";

/** How far the page must scroll before the header goes solid. */
const SCROLL_THRESHOLD = 24;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Navigating away with the mobile panel open would otherwise leave it (and the
  // scroll lock) stuck on the next page. Adjusted during render rather than in
  // an effect, so the panel never paints once in the wrong state — and so
  // back/forward navigation closes it too.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    // rAF-throttled: the listener fires on every scroll tick, but we only touch
    // state once per frame, and only when the boolean actually flips.
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
      });
    };

    // Run once on mount — a reload partway down the page must not start
    // transparent over already-scrolled content.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // The panel is solid, so the header must be solid behind it even at scroll 0.
  const solid = scrolled || menuOpen;

  return (
    <header className={styles.header} data-solid={solid} data-menu-open={menuOpen}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink} aria-label="EnWild — home">
          {/* Two stacked variants cross-fading, rather than one image and a CSS
              filter: the mark is two-tone, and any filter that whitens the green
              square also whitens the "e" inside it. */}
          <span className={styles.logoStack}>
            <Image
              src="/logo/enwild_full_logo_white.png"
              alt="Alliance for the Conservation of Enigmatic Wildlife"
              width={2436}
              height={665}
              priority
              className={`${styles.logo} ${styles.logoReverse}`}
            />
            <Image
              src="/logo/enwild_full_logo.png"
              alt=""
              aria-hidden="true"
              width={2436}
              height={665}
              priority
              className={`${styles.logo} ${styles.logoColor}`}
            />
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>

                {item.children ? (
                  <ul className={styles.dropdown}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className={styles.dropdownLink}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>
      </div>

      <nav
        id="site-mobile-nav"
        className={styles.mobilePanel}
        aria-label="Main"
        hidden={!menuOpen}
      >
        <ul className={styles.mobileList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.mobileLink}>
                {item.label}
              </Link>

              {item.children ? (
                <ul className={styles.mobileSubList}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className={styles.mobileSubLink}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** `/pillars` should stay lit while the visitor is on `/pillars/pillar-2`. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
