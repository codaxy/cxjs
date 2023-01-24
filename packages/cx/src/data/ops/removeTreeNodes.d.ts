export function removeTreeNodes<T = any>(
   array: T[],
   criteria: (item?: T, index?: number) => boolean,
   childrenField?: string
): T[];
