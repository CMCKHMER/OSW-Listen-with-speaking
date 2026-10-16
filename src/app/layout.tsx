import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oxford Skills World 3 · Listening Tests (Live Worksheets)",
  description:
    "Six interactive listening tests from Oxford Skills World: Listening with Speaking 3. Live worksheets with auto-save, share links, and print support.",
  keywords: [
    "Oxford Skills World",
    "Listening Tests",
    "ESL worksheets",
    "Live worksheets",
    "interactive worksheets",
  ],
  authors: [{ name: "Oxford University Press" }],
  openGraph: {
    title: "Oxford Skills World 3 · Listening Tests",
    description: "Six interactive listening tests — live, shareable, auto-saving.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxford Skills World 3 · Listening Tests",
    description: "Six interactive listening tests — live, shareable, auto-saving.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Back to CMC floating button — visible on all pages */}
        <a
          href="https://cmckhmer.github.io/Creative-Minds-/"
          style={{
            position: "fixed",
            top: "16px",
            right: "16px",
            zIndex: 99995,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "10px",
            background: "rgba(15,23,42,0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(34,211,238,0.3)",
            color: "#67e8f9",
            fontFamily: "system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          ← Back to CMC
        </a>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
