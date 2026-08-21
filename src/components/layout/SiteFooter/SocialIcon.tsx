import type { Social } from "@/lib/content";

/**
 * Inline so the footer costs no extra requests and the glyphs inherit
 * `currentColor` from whatever surface they sit on.
 */
export function SocialIcon({ platform }: { platform: Social["platform"] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  switch (platform) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "email":
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        >
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
  }
}
