import { create } from 'zustand'

type AppState = {
  // put lightweight UI state here if needed (drawers, filters, etc.)
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}
export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}))
