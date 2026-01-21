import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function Layout({ children, activeSection, setSection }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar activeSection={activeSection} setSection={setSection} />

      <main className="flex-1 w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}