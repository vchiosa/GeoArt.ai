import { Inter } from "next/font/google";
import "./globals.css";
import { SelectionProvider } from "../context/SelectionContext";
import { AuthProvider } from "../context/AuthContext"; // ✅ Import AuthProvider
import Script from "next/script"; // ✅ Import Next.js Script component
import type React from "react"; // ✅ Import React
import { Toaster } from "@/components/ui/toaster"; // ✅ Import the Toaster component

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Tag Manager Script (Runs Asynchronously) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16576246840"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16576246840');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SelectionProvider>
            <div className="w-full min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col">
              <main className="flex-grow">{children}</main>
              {/* Include the Toaster component so toast notifications show up */}
              <Toaster />
            </div>
          </SelectionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
