import { isAccessorChain } from "../../../src/data/createAccessorModelProxy";
import { Selection } from "./Selection";

export class PropertySelection extends Selection {
   selectMultiple(store, records, indexes, { toggle, add } = {}) {
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

   isSelected(store, record, index) {
      return record && record[this.selectedField];
   }
}

PropertySelection.prototype.selectedField = "selected";
PropertySelection.prototype.multiple = false;

Selection.alias("property", PropertySelection);
