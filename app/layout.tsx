import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S/English — Oral Medicine PhD English Plan",
  description: "A six-month listening, speaking and academic English training system for an oral medicine PhD.",
  icons: { icon: "favicon.svg", shortcut: "favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
