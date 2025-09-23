import { isUndefined } from "../../util/isUndefined";

type KeyFn<T> = (item: T) => any;

interface DiffResult<T> {
   added: T[];
   changed: { before: T; after: T }[];
   unchanged: T[];
   removed: T[];
}

export function diffArrays<T>(oldArray: T[], newArray: T[], keyFn: KeyFn<T> = (e) => e): DiffResult<T> {
   const map = new Map<any, T>();

   oldArray.forEach((item) => {
      const key = keyFn(item);
      map.set(key, item);
   });

   const added: T[] = [];
   const changed: { before: T; after: T }[] = [];
   const unchanged: T[] = [];

   newArray.forEach((item) => {
      const key = keyFn(item);
      const oldItem = map.get(key);

      if (isUndefined(oldItem)) {
         added.push(item);
      } else {
         map.delete(key);

         if (item === oldItem) {
            unchanged.push(item);
         } else {
            changed.push({ before: oldItem, after: item });
         }
      }
   });

   const removed = Array.from(map.values());

   return {
      added,
      changed,
      unchanged,
      removed,
   };
}
