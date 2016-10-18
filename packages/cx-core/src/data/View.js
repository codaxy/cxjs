import {Binding} from './Binding';

export class View {

   constructor(config) {
      Object.assign(this, config);
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
      if (this.set)
         return this.store.set(path, value);

      throw new Error('abstract method');
   }

   delete(path) {
      if (this.store)
         return this.store.delete(path);

      throw new Error('abstract method');
   }

   clear() {
      if (this.store)
         return this.store.clear();

      throw new Error('abstract method');
   }

   get(path) {
      return Binding.get(path).value(this.getData());
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
}
