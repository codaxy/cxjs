import {HtmlElement, TextField, Icon, Grid, TreeNode} from 'cx/widgets';
import {Content, Controller, LabelsLeftLayout, KeySelection, TreeAdapter} from 'cx/ui';
import {ExposedRecordView, Binding} from 'cx/data';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';
import {ConfigTable} from '../../../components/ConfigTable';

import {casual} from '../data/casual';

import configs from '../../widgets/configs/TreeNode';

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

            <CodeSnippet putInto="code" fiddle="riuObfzq">{`

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
            ...

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
        </CodeSplit>

        ## `TreeNode` Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
