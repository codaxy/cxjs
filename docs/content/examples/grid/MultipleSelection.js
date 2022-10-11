import { HtmlElement, Checkbox, Grid, Tab, TextField } from 'cx/widgets';
import { Content, Controller, PropertySelection } from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';
import { getSearchQueryPredicate } from 'cx/util';
import { updateArray } from 'cx/data';

class PageController extends Controller {

    init() {
        super.init();

        this.store.set('$page.records', Array.from({length: 20}).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            selected: false
        })));

        this.addTrigger('select-all-click', ['$page.selectAll'], (value) => {
            if (value != null)
                this.store.update('$page.records', updateArray, r => ({ ...r, selected: value }), r => this.visibleIdsMap[r.id]);
        });
    }

    updateSelection(newRecords, instance) {
        this.visibleIdsMap = newRecords.reduce((acc, r) => {
            acc[r.data.id] = true;
            return acc;
        }, {});

        let anySelected, anyUnselected;
        for (let rec of newRecords) {
            if (rec.data.selected === true)
                anySelected = true;

            else if (rec.data.selected === false)
                anyUnselected = true;

            if (anySelected && anyUnselected)
                break;
        }

        this.store.set('$page.selectAll', anySelected && anyUnselected ? null : !!anySelected);
    }
}

export const MultipleSelection = <cx>
    <Md controller={PageController}>

        # Grid with Multiple Selection

        <CodeSplit>

            Grid supports multiple selection. Single select is the default. For additional rows use `Ctrl` key
            or checkboxes.

            To select all rows click the checkbox in the header.

            Example also showcases use of `onTrackMappedRecords` in combination with `onCreateFilter` callback.
            Using `onTrackMappedRecords` we can access filtered records.

            <div style="margin-bottom: 10px" ws>
                <TextField value-bind='$page.searchText' icon='search' placeholder='Search...' showClear style='width: 300px'/>
            </div>

            <Grid
                records-bind='$page.records'
                style={{width: "100%"}}
                columns={[{
                    header: {items: <cx><Checkbox value-bind="$page.selectAll" indeterminate unfocusable /></cx>},
                    field: 'selected',
                    style: 'width: 1px',
                    items: <cx><Checkbox value-bind="$record.selected" unfocusable /></cx>
                },
                    {header: 'Name', field: 'fullName', sortable: true},
                    {header: 'Phone', field: 'phone'},
                    {header: 'City', field: 'city', sortable: true}
                ]}
                selection={{type: PropertySelection, bind: "$page.selection", multiple: true}}
                sorters-bind="$page.sorters"
                filterParams-bind='$page.searchText'
                onCreateFilter={(searchText) => {
                    if (!searchText) return () => true;
                    let predicate = getSearchQueryPredicate(searchText);
                    return record => predicate(record.fullName) || predicate(record.phone) || predicate(record.city);
                }}
                onTrackMappedRecords='updateSelection'
            />

            See also:
            - [Selection](~/concepts/selections)

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="XEEzkJdp">{`
                    class PageController extends Controller {
                        init() {
                            super.init();

                            this.store.set('$page.records', Array.from({length: 20}).map(()=>({
                                fullName: casual.full_name,
                                phone: casual.phone,
                                city: casual.city,
                                selected: false
                            })));

                            this.addTrigger('select-all-click', ['$page.selectAll'], (value) => {
                                if (value != null)
                                    this.store.update('$page.records', updateArray, r => ({ ...r, selected: value }), r => this.visibleIdsMap[r.id]);
                            });
                        }

                        updateSelection(newRecords, instance) {
                            this.visibleIdsMap = newRecords.reduce((acc, r) => {
                                acc[r.data.id] = true;
                                return acc;
                            }, {});

                            let anySelected, anyUnselected;
                            for (let rec of newRecords) {
                                if (rec.data.selected === true)
                                    anySelected = true;

                                else if (rec.data.selected === false)
                                    anyUnselected = true;

                                if (anySelected && anyUnselected)
                                    break;
                            }

                            this.store.set('$page.selectAll', anySelected && anyUnselected ? null : !!anySelected);
                        }
                    }`}
                </CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="XEEzkJdp">{`
                    <Grid
                        records-bind='$page.records'
                        tyle={{width: "100%"}}
                        columns={[{
                            header: {items: <cx><Checkbox value-bind="$page.selectAll" indeterminate unfocusable/></cx>},
                            field: 'selected',
                            style: 'width: 1px',
                            items: <cx><Checkbox value-bind="$record.selected" unfocusable/></cx>
                        },
                            {header: 'Name', field: 'fullName', sortable: true},
                            {header: 'Phone', field: 'phone'},
                            {header: 'City', field: 'city', sortable: true}
                        ]}
                        selection={{type: PropertySelection, bind: "$page.selection", multiple: true}}
                        sorters-bind="$page.sorters"
                        filterParams-bind='$page.searchText'
                        onCreateFilter={(searchText) => {
                            if (!searchText) return () => true;
                            let predicate = getSearchQueryPredicate(searchText);
                            return record => predicate(record.fullName) || predicate(record.phone) || predicate(record.city);
                        }}
                        onTrackMappedRecords='updateSelection'
                    />`}
                </CodeSnippet>
            </Content>

        </CodeSplit>

    </Md>
</cx>
