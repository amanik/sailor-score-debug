import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Sailor — Money Management",
  description: "Money management for business owners and side hustlers",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sailor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        ibmPlexMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-bg-primary text-text-primary"
      >
        <main className="mx-auto w-full max-w-lg min-h-screen relative pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
