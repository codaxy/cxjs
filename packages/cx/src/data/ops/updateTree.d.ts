export function updateTree(
   array: Cx.Record[],
   updateCallback: (item?: Cx.Record, index?: number) => Cx.Record,
   itemFilter?: (item?: Cx.Record, index?: number) => boolean,
   childrenField?: string,
   removeFilter?: (item?: Cx.Record, index?: number) => boolean
): Cx.Record[];
