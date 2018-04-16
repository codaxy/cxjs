import {Url} from './Url';
import {batchUpdatesAndNotify} from '../batchUpdates';
import {SubscriberList} from '../../util/SubscriberList';

let last = 0,
   next = 1,
   transitions = {},
   subscribers = null,
   reload = false,
   navigateConfirmationCallback = null,
   permanentNavigateConfirmation = false;


export class History {

   static connect(store, urlBinding, hashBinding) {
      this.store = store;
      this.urlBinding = urlBinding;
      this.hashBinding = hashBinding;
      this.updateStore();
      window.onpopstate = () => {
         this.updateStore()
      };
   }

   static pushState(state, title, url) {
      return this.confirmAndNavigate(state, title, url);
   }

   static replaceState(state, title, url) {
      return this.navigate(state, title, url, true);
   }

   static reloadOnNextChange() {
      reload = true;
   }

   static addNavigateConfirmation(callback, permanent = false) {
      navigateConfirmationCallback = callback;
      permanentNavigateConfirmation = permanent;
   }

   static confirmAndNavigate(state, title, url, replace) {
      if (!navigateConfirmationCallback)
         return this.navigate(state, title, url, replace);

      let result = navigateConfirmationCallback(url);

      Promise
         .resolve(result)
         .then(value => {
            if (value) {
               if (!permanentNavigateConfirmation)
                  navigateConfirmationCallback = null;
               this.navigate(state, title, url, replace);
            }
         });
      return false;
   }

   static navigate(state, title, url, replace = false) {
      url = Url.resolve(url);

      if (!window.history.pushState || reload) {
         window.location[replace ? "replace" : "assign"](url);
         return true;
      }

      let transition, changed = false;
      batchUpdatesAndNotify(() => {
         changed = this.updateStore(url);
         if (changed)
            transitions[++last] = transition = {
               url,
               state,
               title,
               replace
            }
      }, () => {
         if (transition)
            transition.completed = true;

         //update history once the page is rendered and the title is set
         while (transitions[next] && transitions[next].completed) {
            let tr = transitions[next];
            delete transitions[next];
            next++;
            let op = tr.replace ? "replaceState" : "pushState";
            window.history[op](tr.state, tr.title, tr.url);
            if (subscribers)
               subscribers.notify(tr.url, op);
         }
      });

      return changed;
   }

   static updateStore(href) {
      let url = Url.unresolve(href || document.location.href), hash = null;
      let hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
         hash = url.substring(hashIndex);
         url = url.substring(0, hashIndex);
      }
      if (this.hashBinding)
         this.store.set(this.hashBinding, hash);
      return this.store.set(this.urlBinding, url);
   }

   static subscribe(callback) {
      if (!subscribers)
         subscribers = new SubscriberList();
      return subscribers.subscribe(callback)
   }
}
