import "./globals.css";
import React from "react";

export const metadata = {
  title: "KRISHIOS — Unified Agriculture Ecosystem",
  description: "Evidence-driven agriculture decision desk for Maharashtra farmers. Real-time weather advisories, APMC mandi rates, farm economics calculator, ICAR soil guidance, and government schemes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr">
      <body>{children}</body>
    </html>
  );
}
