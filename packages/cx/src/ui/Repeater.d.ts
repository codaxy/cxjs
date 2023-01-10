import {
   RecordsProp,
   RecordAlias,
   StringProp,
   SortersProp,
   StructuredProp,
   CollatorOptions,
   Widget,
   PureContainerProps,
   Record,
} from "../core";
import { Instance } from "./Instance";

interface RepeaterProps extends PureContainerProps {
   records: RecordsProp;
   recordName?: RecordAlias;
   recordAlias?: RecordAlias;
   indexName?: RecordAlias;
   indexAlias?: RecordAlias;
   cached?: boolean;

   /** Indicate that parent store data should not be mutated. */
   immutable?: boolean;

   /** Indicate that record stores should not be mutated. */
   sealed?: boolean;

   sorters?: SortersProp;

   /** A binding used to store the name of the field used for sorting the collection. Available only if `sorters` are not used. */
   sortField?: StringProp;

   /** A binding used to store the sort direction. Available only if `sorters` are not used. Possible values are `"ASC"` and `"DESC"`. Defaults to `"ASC"`. */
   sortDirection?: StringProp;

   /** Parameters that affect filtering */
   filterParams?: StructuredProp;

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: Record) => boolean;

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: CollatorOptions;

   /** A field used to get the unique identifier of the record. Setting keyField improves performance on sort operations as the widget is able to movement of records inside the collection.  */
   keyField?: StringProp;

   /** Data adapter used to convert data in the list of records. Used for manipulation of records, e.g flattening the tree records. */
   dataAdapter?: any;
}

export class Repeater extends Widget<RepeaterProps> {}
