export function updateTree(
    array: any[],
    updateCallback: (item: any, index: number) => any,
    itemFilter: (item: any, index?: number) => any,
    childrenField: string
): any[];
