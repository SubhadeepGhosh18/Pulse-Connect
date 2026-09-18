import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PulseProvider } from "@/lib/pulse-context";
import { ToastContainer } from "@/components/ui/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PulseConnect | High-End Freelancing & Talent Matching Platform",
  description:
    "Curated freelancing platform connecting verified enterprises with elite AI researchers, full-stack engineers, and product designers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background text-foreground antialiased selection:bg-accent-indigo selection:text-white`}
      >
        <PulseProvider>
          {children}
          <ToastContainer />
        </PulseProvider>
      </body>
    </html>
  );
}
