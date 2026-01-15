import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import AppHeader from "@/components/navbar/app-header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
