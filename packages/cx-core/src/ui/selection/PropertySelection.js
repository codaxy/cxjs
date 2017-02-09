import {Selection} from './Selection';

export class PropertySelection extends Selection {

   select(store, record, index, {toggle} = {}) {

      if (this.toggle)
         toggle = true;

      if (this.records && this.records.bind) {
         var array = store.get(this.records.bind);
         var rec = array[index];
         if (rec !== record)
            throw new Error('Stale data.');

         var value = rec[this.selectedField];
         var newValue = toggle ? !value : true;

         var newArray = [...array];

         var dirty = false;

         if (newValue && !toggle)
            newArray.forEach((r, i) => {
               if (r != record && r[this.selectedField]) {
                  var nr = Object.assign({}, r);
                  nr[this.selectedField] = false;
                  newArray[i] = nr;
                  dirty = true;
               }
            });

         if (value == newValue && !dirty)
            return;

         var newRec = Object.assign({}, rec);
         newRec[this.selectedField] = newValue;
         newArray[index] = newRec;
         store.set(this.records.bind, newArray);
      }
   }

   isSelected(store, record, index) {
      return record && record[this.selectedField];
   }
}

PropertySelection.prototype.selectedField = 'selected';
PropertySelection.prototype.multiple = false;

Selection.alias('property', PropertySelection);