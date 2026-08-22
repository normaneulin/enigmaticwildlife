"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./HeroBanner.module.css";

/** How long each photo holds before the next one starts fading in. */
const HOLD_MS = 7000;

interface HeroSlideshowProps {
  /** Two or more paths under /public, cross-faded in order. */
  images: string[];
}

/**
 * Cross-fades the hero photography.
 *
 * Only opacity and transform animate, so the whole thing runs on the compositor
 * and never lays out. The first frame is the LCP candidate and renders on the
 * server with `priority`; the rest are mounted from an effect, i.e. after the
 * first paint, so eight extra image requests do not queue up in front of it.
 */
export function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [mountRest, setMountRest] = useState(false);

  useEffect(() => setMountRest(true), []);

  useEffect(() => {
    if (!mountRest || images.length < 2) return;

    // A rotating background is decoration. Someone who has asked the system to
    // stop moving things gets the first frame and nothing else.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let timer = 0;

    const start = () => {
      if (timer) return;
      timer = window.setInterval(
        () => setIndex((current) => (current + 1) % images.length),
        HOLD_MS,
      );
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    // Nothing is on screen in a background tab; the interval would only burn
    // decode work and then dump the visitor onto a random frame on return.
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mountRest, images.length]);

  return (
    <div className={styles.slideshow} aria-hidden="true">
      {images.map((src, position) =>
        position === 0 || mountRest ? (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={position === 0}
            sizes="100vw"
            className={styles.slide}
            data-active={position === index}
          />
        ) : null,
      )}
    </div>
  );
}
