"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, MessageSquare, FileText, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavContent() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <h2 className="text-lg font-semibold">My App</h2>
      </div>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  if (isDesktop) {
    return (
      <aside
        className={cn(
          "border-r bg-background transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <NavContent />
      </aside>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <NavContent />
      </SheetContent>
    </Sheet>
  );
}
