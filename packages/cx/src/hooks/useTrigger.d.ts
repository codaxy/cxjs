import { Path } from "../data";

export function addExploreCallback(callback: any): () => void;

export function useTrigger(args: Array<Path>, callback: (...args) => void): () => void;