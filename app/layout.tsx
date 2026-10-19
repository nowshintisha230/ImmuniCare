import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: {
    default: "ImmuniCare",
    template: "%s | ImmuniCare",
  },
  description:
    "Track your child's vaccinations, get reminders, and explore vaccine information with ImmuniCare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bengali.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}