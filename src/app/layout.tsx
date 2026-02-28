"use client"

import { Outfit, Figtree, Quicksand } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from "next-auth/react";
import { SessionExpiryWatcher } from '@/components/sessionExpiryWatcher';
import Providers from './provider';
import { Toaster } from '@/components/ui/sonner';

const outfit = Outfit({ subsets: ["latin"] });
const figtree = Figtree({ subsets: ['latin'] });
const quicksand = Quicksand({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${figtree.className} ${quicksand.className} dark:bg-gray-900`}>
<<<<<<< HEAD
        <ThemeProvider>
          <SidebarProvider>
            <Providers>
              <div className="flex">
                <main className="flex-1 min-h-screen">
                  {children}
                  <Toaster position='top-right'/>
                </main>
              </div>
            </Providers>
=======
        <SessionProvider>
          <SessionExpiryWatcher /> 
          <ThemeProvider>
            <SidebarProvider>
              <Providers>
                <div className="flex">
                  <main className="flex-1 min-h-screen">
                    {children}
                    <Toaster position='top-right' />
                  </main>
                </div>
              </Providers>
>>>>>>> 20db1bec57d1eebbbbb7ec76ca75d5add72f1386
            </SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}