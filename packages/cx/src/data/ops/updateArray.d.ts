export function updateArray<T>(
    array: T[],
    updateCallback: (item: T, index?: number) => T,
    itemFilter: (item: T, index?: number) => any
) : T[];