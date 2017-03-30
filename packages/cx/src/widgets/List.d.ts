import * as Cx from '../core';

interface ListProps extends Cx.StyledContainerProps {
    
    /** An array of records to be displayed in the list. */
    records?: Cx.RecordsProp,
    
    /** Used for sorting the list. */
    sorters?: Cx.Sorter[],
    
    filterParams?: Cx.StructuredProp, 
    
    itemStyle?: Cx.StyleProp,
    
    emptyText?:  Cx.StringProp
}

export class List extends Cx.Widget<ListProps> {}
