export function findTreePath<T>(
   array: T[],
   criteria: (item: T) => boolean,
   childrenField = "$children",
   currentPath: T[] = []
): T[] | false;
