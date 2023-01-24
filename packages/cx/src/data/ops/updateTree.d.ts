export function updateTree<T = any>(
   array: T[],
   updateCallback: (item?: T, index?: number) => T,
   itemFilter?: (item?: T, index?: number) => boolean,
   childrenField?: string,
   removeFilter?: (item?: T, index?: number) => boolean
): T[];
