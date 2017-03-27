import {Url} from './Url';

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
      if (window.history.pushState) {
         url = Url.resolve(url);
         window.history.pushState(state, title, url);
         this.updateStore(url);
         return true;
      }
   }

   static replaceState(state, title, url) {
      if (window.history.replaceState) {
         url = Url.resolve(url);
         window.history.replaceState(state, title, url);
         this.updateStore(url);
         return true;
      }
   }

   static updateStore(href) {
      var url = Url.unresolve(href || document.location.href);
      var hashIndex = url.indexOf('#');
      if (hashIndex != -1)
         url = url.substring(0, hashIndex);
      this.store.set(this.bind, url);
   }
}
