import {Url} from './Url';
import {batchUpdates} from '../batchUpdates';

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
      this.navigate(state, title, url);
   }

   static replaceState(state, title, url) {
      this.navigate(state, title, url, true);
   }

   static navigate(state, title, url, replace = false) {
      if (window.history.pushState) {
         url = Url.resolve(url);
         let changed = false;
         batchUpdates(() => {
            changed = this.updateStore(url);
         }, () => {
            //update history once the page is rendered and the title is set (SEO)
            if (changed) {
               if (replace)
                  window.history.replaceState(state, title, url);
               else
                  window.history.pushState(state, title, url);
            }
         });
         return changed;
      }
   }

   static updateStore(href) {
      let url = Url.unresolve(href || document.location.href);
      let hashIndex = url.indexOf('#');
      if (hashIndex != -1)
         url = url.substring(0, hashIndex);
      return this.store.set(this.bind, url);
   }
}
