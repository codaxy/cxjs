import { View } from "cx/data";
import produce, { setAutoFreeze } from "immer";

export function enableImmerMutate() {
   // Unless `sealed`, some views in CxJS actually "enrich" the data with aliased properties.
   setAutoFreeze(false);

   View.prototype.mutate = function (path, callback) {
      if (arguments.length == 1) this.update((draft) => produce(draft, path));
      else this.update(path, (draft) => produce(draft, callback));
   };
}
