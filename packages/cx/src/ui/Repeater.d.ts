import * as Cx from "../core";
import { Instance } from "./Instance";

interface RepeaterProps extends Cx.PureContainerProps {
   records: Cx.RecordsProp;
   recordName?: string;
   recordAlias?: string;
   indexName?: string;
   indexAlias?: string;
   cached?: boolean;

   /** Indicate that parent store data should not be mutated. */
   immutable?: boolean;

   /** Indicate that record stores should not be mutated. */
   sealed?: boolean;

   sorters?: Cx.SortersProp;

   /** A binding used to store the name of the field used for sorting the collection. Available only if `sorters` are not used. */
   sortField?: Cx.StringProp;

   /** A binding used to store the sort direction. Available only if `sorters` are not used. Possible values are `"ASC"` and `"DESC"`. Deafults to `"ASC"`. */
   sortDirection?: Cx.StringProp;

   /** Parameters that affect filtering */
   filterParams?: Cx.StructuredProp;

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: Cx.Record) => boolean;
}

export class Repeater extends Cx.Widget<RepeaterProps> {}
