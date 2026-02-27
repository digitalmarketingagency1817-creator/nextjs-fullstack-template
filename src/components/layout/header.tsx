"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/server/auth/client";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Settings, User } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                <AvatarFallback>
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
