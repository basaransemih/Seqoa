import type { Metadata, Viewport } from "next";
import "./globals.css";
import StatusIndicator from "@/components/StatusIndicator";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata: Metadata = {
  title: "Seqoa | Privacy-First Meta-Search",
  description: "AI-powered meta-aggregation search engine. Privacy-focused, fast, and intelligent.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <main>{children}</main>
          <StatusIndicator />
        </SettingsProvider>
      </body>
    </html>
  );
}
