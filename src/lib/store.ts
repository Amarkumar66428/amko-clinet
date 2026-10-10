import { useSyncExternalStore } from "react";

// Minimal global store usable outside React (e.g. from the API client).
export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  const get = () => state;
  const set = (next) => {
    state = typeof next === "function" ? next(state) : next;
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const useStore = () => useSyncExternalStore(subscribe, get, () => initialState);

  return { get, set, useStore };
}
