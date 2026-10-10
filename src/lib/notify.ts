import type { AlertColor } from "@mui/material";
import { createStore } from "./store";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface ServerError {
  code: number;
  message: string;
}

export const snackbarStore = createStore<SnackbarState>({ open: false, message: "", severity: "info" });

export function notify(message: string, severity: AlertColor = "info"): void {
  snackbarStore.set({ open: true, message, severity });
}

export const serverErrorStore = createStore<ServerError | null>(null);
