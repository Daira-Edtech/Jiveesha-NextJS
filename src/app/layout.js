import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata = {
  title: "Daira",
  description: "Manage your classroom and track student progress with ease.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="overflow-hidden">
        <QueryProvider>
          <LanguageProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
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
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
