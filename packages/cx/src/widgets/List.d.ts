import {
   BooleanProp,
   ClassProp,
   CollatorOptions,
   Config,
   Record,
   RecordAlias,
   RecordsProp,
   SortersProp,
   StringProp,
   StructuredProp,
   StyledContainerProps,
   StyleProp,
   Widget,
} from "../core";
import { Instance } from "./../ui/Instance";

interface ListProps extends StyledContainerProps {
   /** An array of records to be displayed in the list. */
   records?: RecordsProp;

   /** Used for sorting the list. */
   sorters?: SortersProp;

   /** A binding used to store the name of the field used for sorting the collection. Available only if `sorters` are not used. */
   sortField?: StringProp;

   /** A binding used to store the sort direction. Available only if `sorters` are not used. Possible values are `"ASC"` and `"DESC"`. Defaults to `"ASC"`. */
   sortDirection?: StringProp;

   /** CSS style that will be applied to all list items. */
   itemStyle?: StyleProp;

   /** CSS class that will be applied to all list items. */
   itemClass?: ClassProp;

   /** CSS class that will be applied to all list items. */
   itemClassName?: ClassProp;

   emptyText?: StringProp;

   /** Grouping configuration. */
   grouping?: Config;

   recordName?: RecordAlias;
   indexName?: RecordAlias;

   /** Base CSS class to be applied to the element. Defaults to 'list'. */
   baseClass?: string;

   focusable?: boolean;
   focused?: boolean;
   itemPad?: boolean;
   cached?: boolean;

   /** Selection configuration. */
   selection?: Config;

   /** Parameters that affect filtering */
   filterParams?: StructuredProp;

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: Record) => boolean;

   /** Scrolls selection into the view. Default value is false. */
   scrollSelectionIntoView?: boolean;

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: CollatorOptions;

   /** Parameter used for disabling specific items in the list. */
   itemDisabled?: BooleanProp;

   /** Lists in this mode perform selection automatically without offering cursor navigation. */
   selectMode?: boolean;

   /** If this field is set to true pressing the Tab key will select the item under cursor. */
   selectOnTab?: boolean;

   /** Callback to be invoked when the list is being scrolled. Useful for loading additional items. */
   onScroll?: (event: Event, instance: Instance) => void;
}

export class List extends Widget<ListProps> {}
