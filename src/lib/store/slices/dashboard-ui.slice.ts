import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DashboardUiState = {
  activeDashboardId: string | null;
  sidebarCollapsed: boolean;
  activeThreadId: string | null;
  copilotSidebarOpen: boolean;
};

const ACTIVE_THREAD_STORAGE_KEY = "ai_workspace_active_thread_id";

const getInitialActiveThreadId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_THREAD_STORAGE_KEY);
};

const initialState: DashboardUiState = {
  activeDashboardId: null,
  sidebarCollapsed: false,
  activeThreadId: getInitialActiveThreadId(),
  copilotSidebarOpen: true,
};

const dashboardUiSlice = createSlice({
  name: "dashboardUi",
  initialState,
  reducers: {
    setActiveDashboard(state, action: PayloadAction<string | null>) {
      state.activeDashboardId = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveThreadId(state, action: PayloadAction<string | null>) {
      state.activeThreadId = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem(ACTIVE_THREAD_STORAGE_KEY, action.payload);
        } else {
          localStorage.removeItem(ACTIVE_THREAD_STORAGE_KEY);
        }
      }
    },
    setCopilotSidebarOpen(state, action: PayloadAction<boolean>) {
      state.copilotSidebarOpen = action.payload;
    },
    toggleCopilotSidebar(state) {
      state.copilotSidebarOpen = !state.copilotSidebarOpen;
    },
  },
});

export const {
  setActiveDashboard,
  toggleSidebar,
  setActiveThreadId,
  setCopilotSidebarOpen,
  toggleCopilotSidebar,
} = dashboardUiSlice.actions;
export default dashboardUiSlice.reducer;
