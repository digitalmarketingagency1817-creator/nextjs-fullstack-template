import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "ui-store", // localStorage key
    }
  )
);

// Usage in components — use selectors to avoid unnecessary re-renders:
// const sidebarOpen = useUIStore((s) => s.sidebarOpen);
// const toggleSidebar = useUIStore((s) => s.toggleSidebar);
//
// NEVER do: const { sidebarOpen, toggleSidebar } = useUIStore();
// ^ This subscribes to ALL state changes
