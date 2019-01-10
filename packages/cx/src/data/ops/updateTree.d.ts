interface TreeItem {
    [key: string]: any,
    [childrenField: string]: Array<TreeItem>
}

export function updateTree(
    array: Array<TreeItem>,
    updateCallback: (item?: TreeItem, index?: number) => TreeItem,
    itemFilter?: (item?: TreeItem, index?: number) => boolean,
    childrenField?: string,
    removeFilter?: (item?: TreeItem, index?: number) => boolean,
): Array<TreeItem>;
