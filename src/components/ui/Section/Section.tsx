import type { ReactNode } from "react";

import styles from "./Section.module.css";

interface SectionProps {
  /** Renders an anchor target for links like /about#history. */
  id?: string;
  title?: string;
  intro?: string;
  tone?: "default" | "surface";
  children?: ReactNode;
}

/** Standard page band: centered container, consistent rhythm, anchor offset. */
export function Section({
  id,
  title,
  intro,
  tone = "default",
  children,
}: SectionProps) {
  return (
    <section id={id} className={styles.section} data-tone={tone}>
      <div className={styles.inner}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {intro ? <p className={styles.intro}>{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
