import * as Cx from '../core';
import {PropertySelection, KeySelection} from '../ui/selection';

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
   cached?: boolean,

   /** Selection configuration. */
   selection?: typeof PropertySelection | typeof KeySelection

}

export class List extends Cx.Widget<ListProps> {}
