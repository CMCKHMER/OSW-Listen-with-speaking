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
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
