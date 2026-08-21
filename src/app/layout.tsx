import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";

import { SiteFooter, SiteHeader } from "@/components/layout";
import { getSiteSettings } from "@/lib/content";
import styles from "./layout.module.css";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  const site = getSiteSettings();

  return {
    title: {
      default: `${site.name} | ${site.legal_name}`,
      template: `%s | ${site.name}`,
    },
    description: site.slogan,
    icons: {
      icon: [
        { url: "/favicon.ico", media: "(prefers-color-scheme: light)" },
        { url: "/favicon_1.ico", media: "(prefers-color-scheme: dark)" },
      ],
    },
    openGraph: {
      siteName: site.name,
      type: "website",
      locale: "en_PH",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main" className={styles.skipLink}>
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className={styles.main}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
