import { Outfit } from 'next/font/google';
import './globals.css';
import type { Metadata } from "next";

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
