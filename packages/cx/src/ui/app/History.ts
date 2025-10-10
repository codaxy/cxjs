import { Url } from "./Url";
import { batchUpdatesAndNotify } from "../batchUpdates";
import { SubscriberList } from "../../util/SubscriberList";
import { View } from "../../data/View";

interface Transition {
   url: string;
   state: any;
   title: string;
   replace: boolean;
   completed?: boolean;
}

type NavigateConfirmationCallback = (state: any) => boolean | Promise<boolean>;

let last = 0;
let next = 1;
let transitions: Record<number, Transition> = {};
let subscribers: SubscriberList | null = null;
let reload = false;
let navigateConfirmationCallback: NavigateConfirmationCallback | null = null;
let permanentNavigateConfirmation = false;

export class History {
   static store: View;
   static urlBinding: string;
   static hashBinding?: string;

   static connect(store: View, urlBinding: string, hashBinding?: string): void {
      this.store = store;
      this.urlBinding = urlBinding;
      this.hashBinding = hashBinding;
      this.updateStore();
      window.onpopstate = () => {
         this.updateStore();
      };
   }

   static pushState(state: any, title: string, url: string): boolean {
      return this.confirmAndNavigate(state, title, url);
   }

   static replaceState(state: any, title: string, url: string): boolean {
      return this.navigate(state, title, url, true);
   }

   static reloadOnNextChange(): void {
      reload = true;
   }

   static addNavigateConfirmation(callback: NavigateConfirmationCallback, permanent = false): void {
      navigateConfirmationCallback = callback;
      permanentNavigateConfirmation = permanent;
   }

   static confirm(continueCallback: () => boolean, state: any): boolean {
      if (!navigateConfirmationCallback) return continueCallback();

      let result = navigateConfirmationCallback(state);
      Promise.resolve(result).then((value) => {
         if (value) {
            if (!permanentNavigateConfirmation) navigateConfirmationCallback = null;
            continueCallback();
         }
      });

      return false;
   }

   static confirmAndNavigate(state: any, title: string, url: string, replace?: boolean): boolean {
      return this.confirm(() => this.navigate(state, title, url, replace), url);
   }

   static navigate(state: any, title: string, url: string, replace = false): boolean {
      url = Url.resolve(url);

      if (!window.history.pushState || reload) {
         window.location[replace ? "replace" : "assign"](url);
         return true;
      }

      let transition: Transition | undefined;
      let changed = false;
      batchUpdatesAndNotify(
         () => {
            changed = this.updateStore(url);
            if (changed)
               transitions[++last] = transition = {
                  url,
                  state,
                  title,
                  replace,
               };
         },
         () => {
            if (transition) transition.completed = true;

            //update history once the page is rendered and the title is set
            while (transitions[next] && transitions[next].completed) {
               let tr = transitions[next];
               delete transitions[next];
               next++;
               let op = tr.replace ? "replaceState" : "pushState";
               window.history[op](tr.state, tr.title, tr.url);
               if (subscribers) subscribers.notify(tr.url, op);
            }
         },
      );

      return changed;
   }

   static updateStore(href?: string): boolean {
      let url = Url.unresolve(href || document.location.href);
      let hash: string | null = null;
      let hashIndex = url.indexOf("#");
      if (hashIndex !== -1) {
         hash = url.substring(hashIndex);
         url = url.substring(0, hashIndex);
      }
      if (this.hashBinding) this.store.set(this.hashBinding, hash);
      return this.store.set(this.urlBinding, url);
   }

   static subscribe(callback: (url: string, op: string) => void): () => void {
      if (!subscribers) subscribers = new SubscriberList();
      return subscribers.subscribe(callback);
   }
}
