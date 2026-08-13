import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "EnWild | Alliance for the Conservation of Enigmatic Wildlife",
  description: "Every species matters. Every voice counts.",
  icons: {
    icon: [
      { url: '/favicon.ico', media: '(prefers-color-scheme: light)' },
      { url: '/favicon_1.ico', media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
