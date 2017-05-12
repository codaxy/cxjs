import * as Cx from '../core';
import { Instance } from './Instance';

interface RepeaterProps extends Cx.PureContainerProps {
    records: Cx.RecordsProp,
    sorters?: Cx.RecordsProp,
    recordName?: string,
    recordAlias?: string,
    indexName?: string,
    indexAlias?: string,
    cached?: boolean,
    immutable?: boolean

   /** Parameters that affect filtering */
   filterParams?: Cx.StructuredProp,

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: Cx.Record) => boolean;
}

export class Repeater extends Cx.Widget<RepeaterProps> {}
