import { create } from "zustand";

interface DashboardState {
  liveMode: boolean;
  setLiveMode: (v: boolean) => void;
  region: string;
  setRegion: (v: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  liveMode: true,
  setLiveMode: (v) => set({ liveMode: v }),
  region: "Global",
  setRegion: (v) => set({ region: v }),
}));
