const DB_NAME = 'pcfh-db';
const STORE = 'documents';

type StoredRecord = {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  blob?: Blob;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addDocumentFromFile(file: File) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const rec: StoredRecord = {
    id,
    name: file.name,
    type: 'PDF',
    date: new Date().toLocaleString(),
    status: 'completed',
    blob: file,
  };

  const db = await openDB();
  return new Promise<StoredRecord>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.add(rec as any);
    req.onsuccess = () => {
      resolve(rec);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getAllDocuments() {
  const db = await openDB();
  return new Promise<StoredRecord[]>((resolve, _reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as StoredRecord[]);
    req.onerror = () => resolve([]);
  });
}

export async function deleteDocument(id: string) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getDocumentBlob(id: string): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, _reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ? (req.result as StoredRecord).blob : undefined);
    req.onerror = () => resolve(undefined);
  });
}
