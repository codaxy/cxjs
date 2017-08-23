import {Selection} from './Selection';
import {isArray} from '../../util/isArray';

export class KeySelection extends Selection {
   init() {
      super.init();

      if (this.bind && !this.selection)
         this.selection = {
            bind: this.bind
         };

      if (!this.selection)
         this.selection = {};

      if (isArray(this.keyFields))
         this.keyField = false;

      this.initialized = true;
   }

   getKey(record) {

      if (this.key != null)
         return this.key;

      if (!record)
         return null;

      if (this.keyField)
         return record[this.keyField];

      var key = {};
      this.keyFields.forEach(k=> {
         key[k] = record[k]
      });
      return key;
   }

   areKeysEqual(key1, key2) {

      if (this.keyField)
         return key1 === key2 && key1 != null;

      if (!key1 || !key2)
         return false;

      return !this.keyFields.some(k => key1[k] !== key2[k]);
   }

   declareData() {
      return super.declareData({
         $selection: {structured: true}
      }, ...arguments);
   }

   configureWidget(widget) {

      if (!this.initialized)
         this.init();

      widget.$selection = Object.assign(widget.$selection || {}, {
         keys: this.selection
      });

      return super.configureWidget(widget);
   }

   select(store, record, index, {toggle} = {}) {
      if (!this.selection.bind)
         return false;

      if (this.toggle)
         toggle = true;

      var key = this.getKey(record);
      var selection = store.get(this.selection.bind);
      if (!this.multiple) {
         if (!toggle)
            store.set(this.selection.bind, key);
         else if (this.areKeysEqual(selection, key))
            store.delete(this.selection.bind);
      } else {
         if (this.storage == 'array') {
            var exists = isArray(selection) && selection.some(x=>this.areKeysEqual(x, key));
            if (!toggle)
               store.set(this.selection.bind, [key]);
            else if (!exists)
               store.set(this.selection.bind, [...(selection || []), key]);
            else
               store.set(this.selection.bind, selection.filter(x=>!this.areKeysEqual(x, key)));
         }
         else if (this.storage == 'hash') {
            var newSelection = Object.assign({}, selection);
            newSelection[key] = true;
            store.set(this.selection.bind, newSelection);
         }
      }
   }

   getIsSelectedDelegate(store) {
      if (!this.selection.bind)
         return () => false;

      var selection = store.get(this.selection.bind);

      if (this.multiple) {
         if (this.storage == 'array') {
            selection = selection || [];
            return (record, index) => selection.some(k=>this.areKeysEqual(this.getKey(record), k));
         } else {
            selection = selection || {};
            return (record, index) => selection[this.getKey(record)];
         }
      } else
         return (record, index) => this.areKeysEqual(selection, this.getKey(record));
   }

   isSelected(store, record, index) {
      return this.getIsSelectedDelegate(store)(record, index);
   }
}

KeySelection.prototype.multiple = false;
KeySelection.prototype.keyField = 'id';
KeySelection.prototype.storage = 'array';

Selection.alias('key', KeySelection);