import { Controller, KeySelection, TreeAdapter } from 'cx/ui';
import { Content, Grid, Tab, TreeNode } from 'cx/widgets';
import { ConfigTable } from '../../components/ConfigTable';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';
import { Md } from '../../components/Md';
import configs from '../widgets/configs/TreeNode';
import { casual } from '../examples/data/casual';

class PageController extends Controller {
    onInit() {
        this.idSeq = 0;
        this.store.set('$page.data', this.generateRecords());
    }

    generateRecords(node) {
        if (!node || node.$level < 5)
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

export const TreeGrid = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Tree Grid

            The following example shows how to make a tree out of grid control.

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
                    if (!node || node.$level < 5)
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
            `}</CodeSnippet>
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

            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## `TreeNode` Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
