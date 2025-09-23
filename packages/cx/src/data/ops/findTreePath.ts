export function findTreePath<T extends Record<string, any>>(
   array: T[] | undefined,
   criteria: (node: T) => boolean,
   childrenField: keyof T = "$children" as keyof T,
   currentPath: T[] = [],
): T[] | false {
   if (!Array.isArray(array)) return false;

   for (const node of array) {
      currentPath.push(node);

      if (criteria(node)) return [...currentPath];

      const children = node[childrenField] as T[] | undefined;

      const childPath = findTreePath(children, criteria, childrenField, currentPath);
      if (childPath) return childPath;

      currentPath.pop();
   }

   return false;
}
