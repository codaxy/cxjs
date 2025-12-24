import { updateTree } from "./updateTree";

export function removeTreeNodes<T = any>(
   array: T[] | undefined,
   criteria: (node: T) => boolean,
   childrenField: keyof T,
): T[] | undefined {
   return updateTree(
      array,
      (x) => x,
      () => false,
      childrenField,
      criteria,
   );
}
