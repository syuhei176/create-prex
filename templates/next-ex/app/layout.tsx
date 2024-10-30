import type { Metadata } from "next";
import localFont from "next/font/local";
import "@prex0/uikit/styles.css";
import "./globals.css";
import { ProvidersForExternalWallet } from "./providers-for-external-wallet";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SwapApp",
  description: "Swap your tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ProvidersForExternalWallet>
          {children}
        </ProvidersForExternalWallet>
      </body>
    </html>
  );
}
