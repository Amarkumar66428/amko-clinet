import { useSyncExternalStore } from "react";

type Updater<T> = T | ((prev: T) => T);

// Minimal global store usable outside React (e.g. from the API client).
export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const get = () => state;
  const set = (next: Updater<T>) => {
    state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const useStore = () => useSyncExternalStore(subscribe, get, () => initialState);

  return { get, set, useStore };
}
