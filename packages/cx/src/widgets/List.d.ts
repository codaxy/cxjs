import * as Cx from '../core';

interface ListProps extends Cx.StyledContainerProps {
    
   /** An array of records to be displayed in the list. */
   records?: Cx.RecordsProp,
    
   /** Used for sorting the list. */
   sorters?: Cx.Sorter[],
    
   filterParams?: Cx.StructuredProp, 
    
   itemStyle?: Cx.StyleProp,
    
   emptyText?:  Cx.StringProp,
   
   /** Grouping configuration. */
   grouping?: Cx.Config,

   recordName?: string,
   indexName?: string,

   /** Base CSS class to be applied to the element. Defaults to 'list'. */
   baseClass?: string,
   
   focusable?: boolean,
   focused?: boolean,
   itemPad?: boolean,
   cached?: boolean

}

export class List extends Cx.Widget<ListProps> {}
