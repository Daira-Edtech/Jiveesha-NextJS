"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  if (pathname === "/") {
    return <>{children}</>;
  }
  
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    // Auth pages without sidebar
    return children;
  }

  // Dashboard pages with sidebar
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="p-4 border-b md:hidden flex-shrink-0">
            <SidebarTrigger />
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
