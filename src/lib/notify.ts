import { createStore } from "./store";

export const snackbarStore = createStore({ open: false, message: "", severity: "info" });

export function notify(message, severity = "info") {
  snackbarStore.set({ open: true, message, severity });
}

export const serverErrorStore = createStore(null);
