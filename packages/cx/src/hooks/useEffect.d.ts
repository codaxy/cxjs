export function useEffect(callback: () => () => void): void;

export function useCleanup(cleanupCallback: () => void): () => void;