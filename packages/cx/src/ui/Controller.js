import {computable} from '../data/computable';
import {Component} from './Component';

export class Controller extends Component {

   init() {
      super.init();
      if (this.onInit)
         this.onInit();
   }

   explore(context) {
      var {store} = this.instance;
      this.store = store; //in rare cases instance may change its store

      if (!this.initialized) {
         this.init();
         this.initialized = true;
      }

      if (this.computables) {
         for (var key in this.computables) {
            store.set(key, this.computables[key](store.getData()));
         }
      }

      if (this.triggers) {
         for (var key in this.triggers) {
            this.triggers[key](store.getData());
         }
      }

      if (this.onExplore) {
         this.onExplore(context);
      }
   }

   prepare(context) {
      if (this.onPrepare) {
         this.onPrepare(context);
      }
   }

   cleanup(context) {
      if (this.onCleanup) {
         this.onCleanup(context);
      }
   }

   addComputable(name, args, callback) {
      if (!Array.isArray(args))
         throw new Error('Second argument to the addComputable method should be an array.');
      var selector = computable(...args, callback).memoize();
      if (!this.computables)
         this.computables = {};
      this.computables[name] = selector;
   }

   addTrigger(name, args, callback, autoRun) {
      if (!Array.isArray(args))
         throw new Error('Second argument to the addComputable method should be an array.');
      var selector = computable(...args, callback).memoize(false, !autoRun && this.store.getData());
      if (!this.triggers)
         this.triggers = {};
      this.triggers[name] = selector;
   }

   removeTrigger(name) {
      if (this.triggers)
         delete this.triggers[name];
   }
}

Controller.namespace = 'ui.controller.';
Controller.lazyInit = true;
