import { Selection, SelectionOptions } from "./Selection";
import { isArray } from "../../util/isArray";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { shallowEquals } from "../../util/shallowEquals";
import { View } from "../../data/View";

export class KeySelection extends Selection {
   selection?: any;
   key?: any;
   keyField?: string | false;
   keyFields?: string[];
   initialized?: boolean;
   storage?: string;

   init(): void {
      if (this.bind && !this.selection)
         this.selection = {
            bind: this.bind,
         };

      if (!this.selection) this.selection = {};

      if (isArray(this.keyFields)) this.keyField = false;

      this.initialized = true;
   }

   getKey(record: any): any {
      if (this.key != null) return this.key;

      if (!record) return null;

      if (this.keyField) return record[this.keyField];

      var key: any = {};
      this.keyFields!.forEach((k) => {
         key[k] = record[k];
      });
      return key;
   }

   areKeysEqual(key1: any, key2: any): boolean {
      if (this.keyField) return key1 === key2 && key1 != null;

      if (!key1 || !key2) return false;

      return !this.keyFields!.some((k) => key1[k] !== key2[k]);
   }

   declareData(...args: any[]): any {
      return super.declareData(
         {
            $selection: { structured: true },
         },
         ...args
      );
   }

   configureWidget(widget: any): any {
      if (!this.initialized) this.init();

      widget.$selection = Object.assign(widget.$selection || {}, {
         keys: this.selection,
      });

      return super.configureWidget(widget);
   }

   selectMultiple(store: View, records: any[], indexes: any[], { toggle, add }: SelectionOptions = {}): any {
      if (!this.selection.bind) return false;

      if (this.toggle) toggle = true;

      if (!isNonEmptyArray(records)) {
         if (!toggle && !add) return store.delete(this.selection.bind);
         return false;
      }

      var keys = records.map((record) => this.getKey(record));
      var selection = store.get(this.selection.bind);
      if (!this.multiple) {
         let key = keys[0];
         if (!toggle || !this.areKeysEqual(selection, key)) store.set(this.selection.bind, key);
         else store.delete(this.selection.bind);
      } else {
         if (this.storage == "array") {
            if (!isArray(selection) || (!toggle && !add)) this.updateSelectionWithShallowEqualsCheck(store, keys);
            else {
               let newSelection = [...selection];
               keys.forEach((key) => {
                  let exists = selection.some((x: any) => this.areKeysEqual(x, key));
                  if (!exists) newSelection.push(key);
                  else if (toggle) newSelection = newSelection.filter((x: any) => !this.areKeysEqual(x, key)); //TODO: optimize
               });
               this.updateSelectionWithShallowEqualsCheck(store, newSelection);
            }
         } else if (this.storage == "hash") {
            let newSelection = toggle ? { ...selection } : {};
            keys.forEach((key) => {
               newSelection[key] = !newSelection[key];
            });
            this.updateSelectionWithShallowEqualsCheck(store, newSelection);
         }
      }
   }

   updateSelectionWithShallowEqualsCheck(store: View, newSelection: any): void {
      store.update(this.selection.bind, (data: any) => (shallowEquals(data, newSelection) ? data : newSelection));
   }

   getIsSelectedDelegate(store: View): (record: any, index: any) => boolean {
      if (!this.selection.bind) return () => false;

      var selection = store.get(this.selection.bind);

      if (this.multiple) {
         if (this.storage == "array") {
            selection = selection || [];
            return (record, index) => selection.some((k: any) => this.areKeysEqual(this.getKey(record), k));
         } else {
            selection = selection || {};
            return (record, index) => selection[this.getKey(record)];
         }
      } else return (record, index) => this.areKeysEqual(selection, this.getKey(record));
   }

   isSelected(store: View, record: any, index: any): boolean {
      return this.getIsSelectedDelegate(store)(record, index);
   }
}

KeySelection.prototype.multiple = false;
KeySelection.prototype.keyField = "id";
KeySelection.prototype.storage = "array";
(KeySelection as any).autoInit = true;

(Selection as any).alias("key", KeySelection);
