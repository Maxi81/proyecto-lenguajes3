import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import NavbarManager from "@/components/navbar-manager";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Suspense } from "react";
import { CartProvider } from "@/components/cart-context";
import CartDrawer from "@/components/cart-drawer";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | La Librería",
    default: "La Librería",
  },
  description: "Tu tienda de Cómics y Mangas favorita.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <HeaderWrapper>
              <Suspense fallback={<div className="h-16 w-full border-b" />}>
                <NavbarManager />
              </Suspense>
            </HeaderWrapper>
            {children}
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
