import { updateTree } from "./updateTree";

/**
 * Recursively removes nodes from a tree structure that match the criteria.
 * Returns a new tree without the matching nodes, or the original tree if no nodes were removed.
 *
 * @param array - The tree data array to filter.
 * @param criteria - Predicate that returns `true` for nodes to remove.
 * @param childrenField - Name of the property containing child nodes.
 * @returns A new tree with matching nodes removed, or the original array if unchanged.
 *
 * @example
 * // Remove node by ID
 * removeTreeNodes(data, node => node.id === targetId, "$children");
 */
export function removeTreeNodes<T = any>(
   array: T[] | undefined,
   criteria: (node: T) => boolean,
   childrenField: NoInfer<keyof T>,
): T[] | undefined {
   return updateTree(
      array,
      (x) => x,
      () => false,
      childrenField,
      criteria,
   );
}
