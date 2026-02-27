import { create } from "zustand";

type UiState = {
  dashboardSidebarOpen: boolean;
  setDashboardSidebarOpen: (open: boolean) => void;
  toggleDashboardSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  dashboardSidebarOpen: true,
  setDashboardSidebarOpen: (open) => set({ dashboardSidebarOpen: open }),
  toggleDashboardSidebar: () =>
    set((state) => ({
      dashboardSidebarOpen: !state.dashboardSidebarOpen,
    })),
}));
