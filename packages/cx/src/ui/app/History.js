import {Url} from './Url';
import {batchUpdatesAndNotify} from '../batchUpdates';

let last = 0, next = 1;
let transitions = {};

export class History {

   static connect(store, bind) {
      this.store = store;
      this.bind = bind;
      this.updateStore();
      window.onpopstate = () => {
         this.updateStore()
      };
   }

   static pushState(state, title, url) {
      return this.navigate(state, title, url);
   }

   static replaceState(state, title, url) {
      return this.navigate(state, title, url, true);
   }

   static navigate(state, title, url, replace = false) {
      if (window.history.pushState) {
         url = Url.resolve(url);
         let changed = false;
         let current = ++last;
         batchUpdatesAndNotify(() => {
            changed = this.updateStore(url);
            if (changed)
               transitions[current] = {
                  url,
                  state,
                  title,
                  replace
               }
         }, () => {
            if (changed)
               transitions[current].completed = true;

            //update history once the page is rendered and the title is set (SEO)
            while (transitions[next] && transitions[next].completed) {
               let tr = transitions[next];
               delete transitions[next];
               if (tr.replace)
                  window.history.replaceState(tr.state, tr.title, tr.url);
               else
                  window.history.pushState(tr.state, tr.title, tr.url);
               next++;
            }
         });
         return changed;
      }
   }

   static updateStore(href) {
      let url = Url.unresolve(href || document.location.href);
      let hashIndex = url.indexOf('#');
      if (hashIndex !== -1)
         url = url.substring(0, hashIndex);
      return this.store.set(this.bind, url);
   }
}
