import { Md } from '../../components/Md';
import { Controller } from 'cx/ui';

class MyController extends Controller {
    onInit() {
    }
}

export const DataAdapters = (
    <cx>
        <div controller={MyController}>
            <Md>
                # Data Adapters

                In CxJS, data adapters are used to convert raw data into a format that can be easily consumed by
                various components such as `Grid`, `List`, `Repeater`, or those like `TreeGrid` with tree structure.
                Data adapters come in three types: **array adapter**, **group adapter**, and **tree adapter**.

                #### Array Adapter
                - Purpose: Transforms data through operations such as mapping or sorting.
                - Example use: Handling flat lists within a `Repeater`.

                #### Group Adapter
                - Purpose: Groups data based on a provided key.
                - Example use: Grouping users by continents within a `Grid`.

                #### Tree Adapter
                - Purpose: Allows expanding records in a tree structure.
                - Example use: Hierarchical data representation in a `TreeGrid`.

                These adapters serve specific purposes in manipulating and organizing data for integration with
                CxJS components, providing a flexible and efficient way to handle various data structures
                across different application needs.
            </Md>
        </div>
    </cx>
);