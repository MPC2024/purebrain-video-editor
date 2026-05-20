import { Geist_Mono, Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { baseUrl, createMetadata } from "@/utils/metadata";
import {
  StoreInitializer,
  BackgroundUploadRunner,
} from "@/components/store-initializer";
import { QueryProvider } from "@/components/query-provider";
// import { Analytics } from "@vercel/analytics/react";
import { Outfit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ServiceWorkerInit } from "@/components/service-worker-init";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = createMetadata({
  title: {
    template: "%s | PureBrain Video Editor",
    default: "PureBrain Video Editor",
  },
  description: "Professional video editor for social content creation.",
  metadataBase: baseUrl,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PureBrain Video Editor",
  },
  formatDetection: {
    telephone: false,
  },
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PureBrain" />
      </head>
      <body
        className={`${geistMono.variable} ${geist.variable} ${outfit.variable} antialiased font-sans bg-muted`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <StoreInitializer />
            <BackgroundUploadRunner />
            <ServiceWorkerInit />
            <Toaster />
          </QueryProvider>
          {/* Analytics removed */}
        </ThemeProvider>
      </body>
    </html>
  );
}
