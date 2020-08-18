import { updateTree } from "./updateTree";

export function removeTreeNodes(array, criteria, childrenField = "$children") {
   return updateTree(array, null, () => false, childrenField, criteria);
}
