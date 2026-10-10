/**
 * Minimal IndexedDB key-value store for invoice drafts. IndexedDB survives reloads and browser
 * restarts like localStorage, but has far more room (logos are stored as data URLs) and doesn't
 * block the main thread while writing.
 */

const DB_NAME = "amk-invoice";
const DB_VERSION = 1;
const STORE = "drafts";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => {
      const db = request.result;
      // Another tab upgraded the schema: drop this connection so the next call reopens it.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("IndexedDB open blocked"));
  }).catch((error: unknown) => {
    dbPromise = null; // allow a retry later (e.g. after the user re-enables storage)
    throw error;
  });
  return dbPromise;
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    // Resolve on commit, not on request success, so a "saved" result really is on disk.
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
  });
}

export const idbGet = (key: string): Promise<unknown> => run("readonly", (store) => store.get(key));

export const idbSet = (key: string, value: unknown): Promise<void> =>
  run("readwrite", (store) => store.put(value, key)).then(() => undefined);
