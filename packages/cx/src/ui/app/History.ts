import { Url } from "./Url";
import { batchUpdatesAndNotify } from "../batchUpdates";
import { SubscriberList } from "../../util/SubscriberList";
import { View } from "../../data/View";

interface Transition {
   url: string;
   state: any;
   title: string | null;
   replace: boolean;
   completed?: boolean;
}

type NavigateConfirmationCallback = (state: any) => boolean | Promise<boolean>;

//history entries created by the router are marked with their position in the history stack,
//which makes it possible to restore the position if the user decides not to leave the page
const historyIndexKey = "__cxHistoryIndex";

let last = 0;
let next = 1;
let transitions: Record<number, Transition> = {};
let subscribers: SubscriberList | null = null;
let reload = false;
let navigateConfirmationCallback: NavigateConfirmationCallback | null = null;
let permanentNavigateConfirmation = false;

//position of the entry which is currently displayed
let historyIndex = 0;

//set while the browser is being sent back to historyIndex, i.e. to the entry which is displayed
let restoringHistory = false;

//set while the browser is being sent to the entry which the user confirmed to navigate to
let replayingTraversal = false;

//set while waiting for the user to confirm a back/forward navigation
let confirmationPending = false;

//how far the confirmed back/forward navigation should travel, relative to historyIndex
let pendingDelta = 0;

//set if the confirmation is answered before the browser gets back to the displayed entry
let replayAfterRestore = false;

function getHistoryIndex(state: any): number | null {
   let index =
      state != null && typeof state == "object" ? state[historyIndexKey] : null;
   return typeof index == "number" ? index : null;
}

function setHistoryIndex(state: any, index: number): any {
   //states which are not plain objects are passed through as they cannot be marked
   if (state != null && (typeof state != "object" || Array.isArray(state)))
      return state;
   return { ...state, [historyIndexKey]: index };
}

//marks the entry which is displayed, so that its position is known after a back/forward navigation
function initHistoryIndex(): void {
   //browsers without pushState support fall back to standard navigation
   if (!window.history.replaceState) return;

   //the entry is already marked if the page was reloaded in the middle of the history stack
   let index = getHistoryIndex(window.history.state);
   if (index != null) {
      historyIndex = index;
      return;
   }

   historyIndex = 0;
   window.history.replaceState(
      setHistoryIndex(window.history.state, historyIndex),
      "",
      window.location.href,
   );
}

//sends the browser back to the entry which is displayed
function restoreHistoryPosition(delta: number): void {
   if (delta == 0) return;
   restoringHistory = true;
   window.history.go(-delta);
}

//applies the back/forward navigation which the user confirmed
function replayTraversal(): void {
   let delta = pendingDelta;
   pendingDelta = 0;

   if (delta == 0) {
      History.updateStore();
      return;
   }

   replayingTraversal = true;
   window.history.go(delta);
}

export class History {
   static store: View;
   static urlBinding: string;
   static hashBinding?: string;

   static connect(store: View, urlBinding: string, hashBinding?: string): void {
      this.store = store;
      this.urlBinding = urlBinding;
      this.hashBinding = hashBinding;
      this.updateStore();
      initHistoryIndex();
      window.onpopstate = () => {
         this.onPopState();
      };
   }

   static onPopState(): void {
      let targetIndex = getHistoryIndex(window.history.state);

      //the confirmed navigation has been applied
      if (replayingTraversal) {
         replayingTraversal = false;
         if (targetIndex != null) historyIndex = targetIndex;
         this.updateStore();
         return;
      }

      //the browser is back at the entry which is displayed
      if (restoringHistory) {
         restoringHistory = false;
         if (replayAfterRestore) {
            replayAfterRestore = false;
            replayTraversal();
         }
         return;
      }

      if (!navigateConfirmationCallback) {
         if (targetIndex != null) historyIndex = targetIndex;
         this.updateStore();
         return;
      }

      //the browser has already left the entry which is displayed, so it's sent back right away
      //to keep the address bar in sync with the page while the confirmation is pending
      let targetUrl = Url.unresolve(window.location.href);
      let delta = targetIndex != null ? targetIndex - historyIndex : -1;
      restoreHistoryPosition(delta);

      //additional back/forward presses are ignored while the confirmation is being answered
      if (confirmationPending) return;

      confirmationPending = true;
      pendingDelta = delta;

      this.confirm(
         () => {
            confirmationPending = false;
            //the browser may still be on its way back to the displayed entry
            if (restoringHistory) replayAfterRestore = true;
            else replayTraversal();
            return true;
         },
         targetUrl,
         //the browser is already back at the displayed entry, only the flag needs resetting
         () => {
            confirmationPending = false;
         },
      );
   }

   static pushState(state: any, title: string | null, url: string): boolean {
      return this.confirmAndNavigate(state, title, url);
   }

   static replaceState(state: any, title: string | null, url: string): boolean {
      return this.navigate(state, title, url, true);
   }

   static reloadOnNextChange(): void {
      reload = true;
   }

   static addNavigateConfirmation(
      callback: NavigateConfirmationCallback,
      permanent = false,
   ): void {
      navigateConfirmationCallback = callback;
      permanentNavigateConfirmation = permanent;
   }

   static removeNavigateConfirmation(): void {
      navigateConfirmationCallback = null;
      permanentNavigateConfirmation = false;
   }

   static confirm(
      continueCallback: () => boolean,
      state: any,
      cancelCallback?: () => void,
   ): boolean {
      if (!navigateConfirmationCallback) return continueCallback();

      let result = navigateConfirmationCallback(state);
      Promise.resolve(result).then((value) => {
         if (value) {
            if (!permanentNavigateConfirmation)
               navigateConfirmationCallback = null;
            continueCallback();
         } else if (cancelCallback) cancelCallback();
      });

      return false;
   }

   static confirmAndNavigate(
      state: any,
      title: string | null,
      url: string,
      replace?: boolean,
   ): boolean {
      return this.confirm(() => this.navigate(state, title, url, replace), url);
   }

   static navigate(
      state: any,
      title: string | null,
      url: string,
      replace = false,
   ): boolean {
      url = Url.resolve(url);

      if (!window.history.pushState || reload || !this.store) {
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
               if (tr.replace) {
                  window.history.replaceState(
                     setHistoryIndex(tr.state, historyIndex),
                     tr.title ?? "",
                     tr.url,
                  );
                  if (subscribers) subscribers.notify(tr.url, "replaceState");
               } else {
                  window.history.pushState(
                     setHistoryIndex(tr.state, ++historyIndex),
                     tr.title ?? "",
                     tr.url,
                  );
                  if (subscribers) subscribers.notify(tr.url, "pushState");
               }
            }
         },
      );

      return changed;
   }

   static updateStore(href?: string): boolean {
      let url = Url.unresolve(href ?? document?.location.href ?? "");
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
