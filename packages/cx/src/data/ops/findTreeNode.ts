/**
 * Recursively searches a tree structure for a node matching the criteria.
 *
 * @param array - The tree data array to search.
 * @param criteria - Predicate that returns `true` when a matching node is found.
 * @param childrenField - Name of the property containing child nodes.
 * @returns The first matching node, or `false` if not found.
 *
 * @example
 * // Find node by ID
 * const node = findTreeNode(data, n => n.id === targetId, "$children");
 *
 * @example
 * // Check if selected node is a leaf
 * const node = findTreeNode(data, n => n.id === selectedId, "$children");
 * if (node && node.$leaf) {
 *   // Cannot add children to a leaf node
 * }
 */
export function findTreeNode<T = any>(array: T[], criteria: (node: T) => boolean, childrenField: NoInfer<keyof T>): T | false {
   if (!Array.isArray(array)) return false;

   for (const node of array) {
      if (criteria(node)) return node;

      const children = node[childrenField] as T[];

      const found = findTreeNode(children, criteria, childrenField);
      if (found) return found;
   }

   return false;
}
