import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riya Tilwani | AI-native full-stack engineer",
  description:
    "AI-first full-stack and backend engineering for startup teams, internal tools, workflow automation, and SaaS products.",
  metadataBase: new URL("https://rtil.fyi")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
