import { View } from './../../data/View';

export class History {
   static connect(store: View, bind: string);

   static pushState(state, title, url: string);

   static replaceState(state, title, url: string);

   static subscribe(callback: (url?: string, op?: "pushState" | "replaceState") => void): () => void;

   static reloadOnNextChange();
}
