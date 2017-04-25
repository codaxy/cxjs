import * as Cx from '../core';

interface RepeaterProps extends Cx.PureContainerProps {
    records: Cx.RecordsProp,
    sorters?: Cx.RecordsProp,
    filterParams?: Cx.StructuredProp,
    recordName?: string,
    recordAlias?: string,
    indexName?: string,
    indexAlias?: string,
    cached?: boolean,
    immutable?: boolean
}

export class Repeater extends Cx.Widget<RepeaterProps> {}
