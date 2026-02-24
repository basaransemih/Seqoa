import type { Metadata, Viewport } from "next";
import "./globals.css";
import StatusIndicator from "@/components/StatusIndicator";

export const metadata: Metadata = {
  title: "Seqoa | Premium Meta-Search Engine",
  description: "Next-generation meta-aggregation search engine with privacy and speed.",
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
        <main>{children}</main>
        <StatusIndicator />
      </body>
    </html>
  );
}
