import { Md } from '../../components/Md';
import { Controller } from 'cx/ui';
import { Content, Tab } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';

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
                various components such as `Grid`, `List`, `Repeater`, or those like `Tree Grid` with tree structure.
                Data adapters come in three types: **array adapter**, **group adapter**, and **tree adapter**.

                #### Array Adapter
                Purpose: Transforms data through operations such as mapping or sorting.
                Example use: Handling flat lists within a `Repeater`.

                #### Group Adapter
                Purpose: Groups data based on a provided key.
                Example use: Grouping users by continents within a `Grid`.

                #### Tree Adapter
                Structures data in a tree-like format, enabling the expansion of individual records.
                See [Tree Grid](~/widgets/tree-grid) for more.

                <CodeSplit>
                    <Content name="code">
                        <div>
                            <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                            <Tab value-bind="$page.code.tab" tab="grid" mod="code"  text="Grid" default/>
                        </div>

                        <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="riuObfzq">{`
                            class PageController extends Controller {
                                onInit() {
                                    this.idSeq = 0;
                                    this.store.set('$page.data', this.generateRecords());
                                }

                                generateRecords(node) {
                                    if (!node || node.$level < 5) {
                                        return Array.from({length: 20}).map(() => ({
                                            id: ++this.idSeq,
                                            fullName: casual.full_name,
                                            phone: casual.phone,
                                            city: casual.city,
                                            notified: casual.coin_flip,
                                            $leaf: casual.coin_flip,
                                            //icon: 'circle'
                                        }));
                                    }
                                }
                            }
                        `}
                        </CodeSnippet>
                        <CodeSnippet visible-expr="{$page.code.tab}=='grid'" fiddle="riuObfzq">{`
                            <Grid
                                buffered
                                records-bind='$page.data'
                                mod="tree"
                                style={{width: "100%", height: '500px'}}
                                scrollable={true}
                                dataAdapter={{
                                    type: TreeAdapter,
                                    load: (context, {controller}, node) => controller.generateRecords(node)
                                }}
                                selection={{type: KeySelection, bind: "$page.selection"}}
                                columns={[
                                    {
                                        header: 'Name', field: 'fullName', sortable: true, items: <cx>
                                        <TreeNode expanded-bind="$record.$expanded"
                                            leaf-bind="$record.$leaf"
                                            level-bind="$record.$level"
                                            loading-bind="$record.$loading"
                                            text-bind="$record.fullName"
                                            icon-bind="$record.icon"
                                        />
                                    </cx>
                                    },
                                    {header: 'Phone', field: 'phone'},
                                    {header: 'City', field: 'city', sortable: true},
                                    {
                                        header: 'Notified',
                                        field: 'notified',
                                        sortable: true,
                                        value: {expr: '{$record.notified} ? "Yes" : "No"'}
                                    }
                                ]}
                            />
                        `}
                        </CodeSnippet>
                    </Content>
                </CodeSplit>

                These adapters serve specific purposes in manipulating and organizing data for integration with
                CxJS components, providing a flexible and efficient way to handle various data structures
                across different application needs.
            </Md>
        </div>
    </cx>
);