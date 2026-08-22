"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Leaf, X } from "lucide-react";

import { NAV_ITEMS } from "@/lib/navigation";
import styles from "./SiteHeader.module.css";

/** How far the page must scroll before the header goes solid. */
const SCROLL_THRESHOLD = 60;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Navigating away with the mobile sheet open would otherwise leave it (and the
  // scroll lock) stuck on the next page. Adjusted during render rather than in
  // an effect, so the sheet never paints once in the wrong state — and so
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

    const sheet = sheetRef.current;
    const toggle = toggleRef.current;

    // The scrolling element here is <html>, not <body>: globals.css puts
    // `overflow-x: hidden` on <html>, and that blocks the usual body → viewport
    // overflow propagation, so locking <body> alone leaves the page scrollable
    // behind the sheet. Both are locked and both are restored.
    const html = document.documentElement;
    const body = document.body;
    const previous = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // The sheet claims aria-modal, so Tab has to honour it.
    const focusable = () =>
      Array.from(
        sheet?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !sheet) return;

      const items = focusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!sheet.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (active === first || active === sheet)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Above 960px the toggle, the backdrop and the sheet are all display:none.
    // Resizing across that line with the menu open would otherwise leave the
    // page scroll-locked with nothing on screen left to unlock it.
    const wide = window.matchMedia("(min-width: 960px)");
    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onWide);
    sheet?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = previous.html;
      body.style.overflow = previous.body;
      window.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onWide);
      // Sending focus back to the control that opened the sheet, but only if it
      // still has it — a route change moves focus on its own.
      if (sheet?.contains(document.activeElement)) toggle?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header} data-solid={scrolled} data-menu-open={menuOpen}>
      <div className={styles.inner}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink} aria-label="EnWild — home">
            {/* Two stacked variants cross-fading, rather than one image and a CSS
                filter: the mark is two-tone, and any filter that whitens the green
                square also whitens the "e" inside it. */}
            <span className={styles.logoStack}>
              <Image
                src="/logo/enwild_full_logo_white.webp"
                alt="Alliance for the Conservation of Enigmatic Wildlife"
                width={2436}
                height={665}
                priority
                className={`${styles.logo} ${styles.logoReverse}`}
              />
              <Image
                src="/logo/enwild_full_logo.webp"
                alt=""
                aria-hidden="true"
                width={2436}
                height={665}
                priority
                className={`${styles.logo} ${styles.logoColor}`}
              />
            </span>
          </Link>
        </div>

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

        <div className={styles.actionsContainer}>
          <Link href="/donate" className={styles.donateButton}>
            <Leaf className={styles.donateIcon} size={17} aria-hidden="true" />
            <span className={styles.donateText}>Donate</span>
          </Link>

          <button
            ref={toggleRef}
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
      </div>

      {/* Tapping anywhere off the sheet closes it. Keyboard users have Escape
          and the toggle itself, so this stays out of the tab order. */}
      <div className={styles.backdrop} onClick={closeMenu} aria-hidden="true" />

      {/* Bottom sheet: thumbs live at the bottom of a phone, not the top, so the
          nav comes to them rather than hanging off the header. */}
      <div
        ref={sheetRef}
        id="site-mobile-nav"
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        inert={!menuOpen}
      >
        <span className={styles.sheetHandle} aria-hidden="true" />

        <nav className={styles.sheetNav} aria-label="Mobile">
          <ul className={styles.mobileList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.mobileLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    className={styles.mobileChevron}
                    size={18}
                    aria-hidden="true"
                  />
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

        <div className={styles.sheetFooter}>
          <Link href="/donate" className={styles.sheetDonate}>
            <Leaf size={18} aria-hidden="true" />
            <span>Donate</span>
          </Link>
          <button
            type="button"
            className={styles.sheetClose}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

/** `/pillars` should stay lit while the visitor is on `/pillars/pillar-2`. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
