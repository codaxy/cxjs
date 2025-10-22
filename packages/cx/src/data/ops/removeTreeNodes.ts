import { updateTree } from "./updateTree";

export function removeTreeNodes<T extends Record<string, any>>(
   array: T[] | undefined,
   criteria: (node: T) => boolean,
   childrenField: keyof T = "$children" as keyof T,
): T[] | undefined {
   return updateTree(
      array,
      (x) => x,
      () => false,
      childrenField,
      criteria,
   );
}
