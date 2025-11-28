import { Selection, SelectionOptions } from "./Selection";
import { View } from "../../data/View";
import { isAccessorChain } from "../../data/createAccessorModelProxy";
import { Binding } from "../Prop";

export interface PropertySelectionConfig {
   /** Name of the field used to indicate selection. Default is `selected`. */
   selectedField?: string;

   /** Set to `true` to allow multiple selection. */
   multiple?: boolean;

   /** Name of the field used as a key. */
   keyField?: string;

   /** Record binding. */
   record?: Binding;

   /** Records binding. */
   records?: Binding;

   /** Index binding. */
   index?: Binding;

   /** Binding path for selection state. */
   bind?: string;
}

export class PropertySelection extends Selection {
   declare records: any;
   declare selectedField: string;

   constructor(config?: PropertySelectionConfig) {
      super(config);
   }

   selectMultiple(store: View, records: any[], indexes: any[], { toggle, add }: SelectionOptions = {}): any {
      if (this.toggle) toggle = true;

      if (!this.records) return false;

      let path = isAccessorChain(this.records) ? this.records.toString() : this.records.bind;
      if (!path) return false;

      let array = store.get(path);
      let newArray = [...array];
      let dirty = false;

      if (!toggle && !add) {
         newArray.forEach((r, i) => {
            if (r[this.selectedField]) {
               let nr = Object.assign({}, r);
               nr[this.selectedField] = false;
               newArray[i] = nr;
               dirty = true;
            }
         });
      }

      records.forEach((record, i) => {
         let index = indexes[i];
         let rec = newArray[index];
         if (array[index] !== record) throw new Error("Stale data.");

         let value = rec[this.selectedField];
         let newValue = add ? true : toggle ? !value : true;

         if (value == newValue) return;

         let newRec = Object.assign({}, rec);
         newRec[this.selectedField] = newValue;
         newArray[index] = newRec;
         dirty = true;
      });

      if (dirty) store.set(path, newArray);
   }

   isSelected(store: View, record: any, index: any): boolean {
      return record && record[this.selectedField!];
   }
}

PropertySelection.prototype.selectedField = "selected";
PropertySelection.prototype.multiple = false;

(Selection as any).alias("property", PropertySelection);
