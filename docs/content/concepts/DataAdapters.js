import { Md } from '../../components/Md';
import { ConfigTable } from '../../components/ConfigTable';
import { arrayAdapterConfig, groupAdapterConfig, treeAdapterConfig } from './configs/DataAdapters';

export const DataAdapters = <cx>
    <Md>
        # Data Adapters

        In CxJS, data adapters are used under the hood to convert raw data into a format that can be easily
        consumed by various components such as `Grid`, `List`, `Repeater`, or those like `Tree Grid` with tree
        structure. Data adapters come in three types: **array adapter**, **group adapter**, and **tree adapter**.

        ### Array Adapter
        Transforms flat lists through operations such as mapping or sorting.
        See [Repeater](~/concepts/data-views#repeater) for more.

        <ConfigTable props={arrayAdapterConfig} />

        ### Group Adapter
        Groups data based on the provided key. Used in components such as `List` and `Grid`.
        See [grouping in lists](~/examples/list/grouping) for more.

        <ConfigTable props={groupAdapterConfig} />

        ### Tree Adapter
        Structures data in a tree-like format, enabling the expansion of individual records.
        See [Tree Grid](~/widgets/tree-grid) for more.
        
        <ConfigTable props={treeAdapterConfig} />

        <br />
        These adapters serve specific purposes in manipulating and organizing data for integration with
        CxJS components, providing a flexible and efficient way to handle various data structures
        across different application needs.
    </Md>
</cx>