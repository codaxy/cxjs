import { updateArray } from "./updateArray";

/**
 * Recursively updates nodes in a tree structure that match a filter.
 * Returns a new tree with updated nodes, or the original tree if no changes were made.
 *
 * @param array - The tree data array to update.
 * @param updateCallback - Function that receives a node and returns the updated node.
 * @param itemFilter - Predicate that returns `true` for nodes to update. If `null`, all nodes are updated.
 * @param childrenField - Name of the property containing child nodes.
 * @param removeFilter - Optional predicate that returns `true` for nodes to remove.
 * @returns A new tree with updates applied, or the original array if unchanged.
 *
 * @example
 * // Expand all non-leaf nodes
 * updateTree(data, node => ({ ...node, $expanded: true }), node => !node.$leaf, "$children");
 *
 * @example
 * // Add a child to a specific node
 * updateTree(data, node => ({ ...node, $children: [...node.$children, newChild] }), node => node.id === parentId, "$children");
 */
export function updateTree<T = any>(
   array: T[] | undefined,
   updateCallback: (item: T) => T,
   itemFilter: ((item: T) => boolean) | null,
   childrenField: keyof T,
   removeFilter?: (item: T) => boolean,
): T[] | undefined {
   return updateArray(
      array,
      (item: T) => {
         if (!itemFilter || itemFilter(item)) item = updateCallback(item);
         const children = item[childrenField];
         if (!Array.isArray(children)) return item;
         const updatedChildren = updateTree(
            children,
            updateCallback,
            itemFilter,
            childrenField,
            removeFilter,
         );
         if (updatedChildren != children)
            return { ...item, [childrenField]: updatedChildren };
         return item;
      },
      null,
      removeFilter,
   );
}
