import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { profile } from "@/content/profile";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.summary,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
