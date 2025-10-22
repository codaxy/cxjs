export function findTreeNode<T extends Record<string, any>>(
   array: T[],
   criteria: (node: T) => boolean,
   childrenField: keyof T = "$children" as keyof T,
): T | false {
   if (!Array.isArray(array)) return false;

   for (const node of array) {
      if (criteria(node)) return node;

      const children = node[childrenField] as T[];

      const found = findTreeNode(children, criteria, childrenField);
      if (found) return found;
   }

   return false;
}
