import { View } from './../../data/View';

export class History {
   static connect(store: View, urlBinding: string, hashBinding?: string);

   static pushState(state, title, url: string);

   static replaceState(state, title, url: string);

   static subscribe(callback: (url?: string, op?: "pushState" | "replaceState") => void): () => void;

   static reloadOnNextChange();

   static addNavigateConfirmation(callback: ((url?: string) => boolean | Promise<boolean>), executeOnlyOnce?: boolean);
}
