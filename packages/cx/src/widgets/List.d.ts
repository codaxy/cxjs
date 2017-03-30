import * as Cx from '../core';

interface ListProps extends Cx.WidgetProps {
    /** An array of records to be displayed in the list. */
    records?: Cx.RecordsProp,
    /** Used for sorting the list. */
    sorters?: Cx.Sorter[],
    filterParams?: , 
    /** Style object applied to the wrapper div. Used for setting the dimensions of the field. */
    style?: Cx.StyleProp,
    itemStyle?: ,
    /** 
     * Additional CSS classes to be applied to the field. 
     * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
     */
    class?: Cx.ClassProp,
    /** 
     * Additional CSS classes to be applied to the field. 
     * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. 
     */
    className?: Cx.ClassProp,
    emptyText?:  
}

export class List extends Cx.Widget<ListProps> {}
