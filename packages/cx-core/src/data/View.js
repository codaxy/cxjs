import {Binding} from './Binding';

export class View {

   constructor(config) {
      Object.assign(this, config);
      this.cache = {
         version: -1
      };
      if (this.store)
         this.setStore(this.store);
   }

   getData() {
      throw new Error('abstract method');
   }

   init(path, value) {
      var currentValue = this.get(path);
      if (typeof currentValue == 'undefined')
         this.set(path, value);
   }

   set(path, value) {
      if (path instanceof Binding)
         path = path.path;
      else if (typeof path == 'object' && path != null) {
         var changed = false;
         for (var key in path)
            if (path.hasOwnProperty(key) && this.setItem(key, path[key]))
               changed = true;
         return changed;
      }
      return this.setItem(path, value);
   }

   //protected
   setItem(path, value) {
      if (this.store)
         return this.store.setItem(path, value);

      throw new Error('abstract method');
   }

   delete(path) {
      if (path instanceof Binding)
         path = path.path;
      else if (arguments.length > 1)
         path = Array.from(arguments);

      if (Array.isArray(path))
         return path.map(arg => this.deleteItem(arg)).some(Boolean);

      return this.deleteItem(path);
   }

   //protected
   deleteItem(path) {
      if (this.store)
         return this.store.deleteItem(path);

      throw new Error('abstract method');
   }

   clear() {
      if (this.store)
         return this.store.clear();

      throw new Error('abstract method');
   }

   get(path) {
      let storeData = this.getData();

      if (arguments.length > 1)
         path = Array.from(arguments);

      if (Array.isArray(path))
         return path.map(arg => Binding.get(arg).value(storeData));

      return Binding.get(path).value(storeData);
   }

   toggle(path) {
      this.set(path, !this.get(path))
   }

   update(path, updateFn, ...args) {
      this.set(path, updateFn.apply(null, [this.get(path), ...args]));
   }

   batch(callback) {
      this.notificationsSuspended = (this.notificationsSuspended || 0) + 1;
      try {
         callback(this);
      }
      finally {
         this.notificationsSuspended--;
         if (this.dirty) {
            this.dirty = false;
            this.notify();
         }
      }
   }

   silently(callback) {
      this.notificationsSuspended = (this.notificationsSuspended || 0) + 1;
      var wasDirty = this.dirty, dirty;
      this.dirty = false;
      try {
         callback(this);
      }
      finally {
         this.notificationsSuspended--;
         dirty = this.dirty;
         this.dirty = wasDirty;
      }
      return dirty;
   }

   notify(path) {
      if (this.notificationsSuspended)
         this.dirty = true;
      else
         this.doNotify(path);
   }

   doNotify(path) {
      if (this.store)
         return this.store.notify(path);

      throw new Error('abstract method');
   }

   subscribe(callback) {
      if (this.store)
         return this.store.subscribe(callback);

      throw new Error('abstract method');
   }

   load(data) {
      this.batch(store=> {
         for (var key in data)
            store.set(key, data[key]);
      });
   }

   dispatch(action) {
      if (this.store)
         return this.store.dispatch(action);

      throw new Error("The underlying store doesn't support dispatch.");
   }

   getMeta() {
      return this.meta;
   }

   setStore(store) {
      this.store = store;
      this.meta = store.getMeta();
   }
}
