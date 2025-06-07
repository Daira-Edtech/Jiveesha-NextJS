"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Routes that should NOT have the sidebar
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <QueryProvider>
          <LanguageProvider>
            {isAuthRoute ? (
              // Auth pages without sidebar
              children
            ) : (
              // Dashboard pages with sidebar
              <SidebarProvider>
                <div className="flex h-screen w-full bg-background">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="p-4 border-b md:hidden flex-shrink-0">
                      <SidebarTrigger />
                    </header>
                    <div className="flex-1 overflow-y-auto">
                      {children}
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            )}
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
