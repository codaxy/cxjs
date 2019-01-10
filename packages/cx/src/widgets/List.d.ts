import * as Cx from '../core';
import {PropertySelection, KeySelection} from '../ui/selection';
import {Instance} from '../ui/Instance';

interface ListProps extends Cx.StyledContainerProps {
    
   /** An array of records to be displayed in the list. */
   records?: Cx.RecordsProp,
    
   /** Used for sorting the list. */
   sorters?: Cx.SortersProp,

   /** A binding used to store the name of the field used for sorting the collection. Available only if `sorters` are not used. */
   sortField?: Cx.StringProp,
   
   /** A binding used to store the sort direction. Available only if `sorters` are not used. Possible values are `"ASC"` and `"DESC"`. Deafults to `"ASC"`. */
   sortDirection?: Cx.StringProp,

   /** CSS style that will be applied to all list items. */
   itemStyle?: Cx.StyleProp,

   /** CSS class that will be applied to all list items. */
   itemClass?: Cx.ClassProp,

   /** CSS class that will be applied to all list items. */
   itemClassName?: Cx.ClassProp,
    
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
   selection?: Cx.Config,

   /** Parameters that affect filtering */
   filterParams?: Cx.StructuredProp,

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: Cx.Record) => boolean;

   /** Scrolls selection into the view. Default value is false. */
   scrollSelectionIntoView?: boolean,
}

export class List extends Cx.Widget<ListProps> {}
