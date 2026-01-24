import { Outfit,  Figtree, Quicksand } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Providers from './provider';

const outfit = Outfit({
  subsets: ["latin"],
});

const figtree = Figtree({
  subsets: ['latin'],
})

const quicksand = Quicksand({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${figtree.className} ${quicksand.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <Providers>
              <div className="flex">
                <main className="flex-1 min-h-screen">
                  {children}
                </main>
              </div>
            </Providers>
            </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
