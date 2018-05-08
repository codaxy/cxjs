import {Selection} from './Selection';
import {isArray} from '../../util/isArray';
import {isNonEmptyArray} from "../../util/isNonEmptyArray";

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

   selectMultiple(store, records, indexes, {toggle, add} = {}) {
      if (!this.selection.bind)
         return false;

      if (this.toggle)
         toggle = true;

      if (!isNonEmptyArray(records)) {
         if (!toggle && !add)
            return store.delete(this.selection.bind);
         return false;
      }

      var keys = records.map(record => this.getKey(record));
      var selection = store.get(this.selection.bind);
      if (!this.multiple) {
         let key = keys[0];
         if (!toggle || !this.areKeysEqual(selection, key))
            store.set(this.selection.bind, key);
         else
            store.delete(this.selection.bind);
      } else {
         if (this.storage == 'array') {
            if (!isArray(selection) || !toggle && !add)
               store.set(this.selection.bind, keys);
            else {
               let newSelection = [...selection];
               keys.forEach(key => {
                  let exists = selection.some(x => this.areKeysEqual(x, key));
                  if (!exists)
                     newSelection.push(key);
                  else if (toggle)
                     newSelection = newSelection.filter(x => !this.areKeysEqual(x, key)); //TODO: optimize
               });
               store.set(this.selection.bind, newSelection);
            }
         }
         else if (this.storage == 'hash') {
            let newSelection = toggle ? {...selection} : {};
            keys.forEach(key => {
               newSelection[key] = !newSelection[key];
            });
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