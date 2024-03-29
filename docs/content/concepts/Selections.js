import { Repeater, Checkbox, Select, Option, Grid, Content, Tab, Text } from 'cx/widgets';
import { Controller, PropertySelection, KeySelection, SimpleSelection } from 'cx/ui';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, Gridlines, ScatterGraph, NumericAxis } from 'cx/charts';
import { Md } from 'docs/components/Md';
import { CodeSplit } from 'docs/components/CodeSplit';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { ImportPath } from '../../components/ImportPath';

class PageController extends Controller {
    onInit() {
        this.store.set('$page.bubbles', Array.from({ length: 15 }).map((v, i) => ({
            name: `Bubble ${i + 1}`,
            x: Math.random() * 100,
            y: Math.random() * 100,
            d: Math.random() * 40,
            selected: i % 2 == 0
        })));
    }
}

export const Selections = <cx>
    <Md controller={PageController}>
        # Selections
        <ImportPath path="import { PropertySelection, KeySelection, SimpleSelection } from 'cx/ui';" />

        Some widgets allow the user to select one or more objects presented to them. If
        only one object can be selected at a time, that's called *single selection mode*. If multiple objects can
        be selected, it's referred to as *multiple selection mode*.

        The question here is what happens after the user selects something? There are multiple ways a selection can
        be handled and `Cx` offers commonly used methods out of the box.

        ## Property Selection

        In this mode, selection is handled by setting a designated selection property to be either `true` or `false`.
        Usually, `selected` property is used.

        This mode is easy to understand with a list of checkboxes. Each checkbox determines whether a corresponding
        record is selected or not.

        <CodeSplit>
            <div class="widgets" controller={PageController}>
                <Svg style={{ width: "400px", height: "400px" }}>
                    <Chart anchors="0 1 1 0" offset="25 -25 -40 50" axes={NumericAxis.XY()}>
                        <Rectangle
                            anchors="0 1 1 0"
                            style={{ fill: "rgba(100, 100, 100, 0.1)" }}
                        />
                        <Gridlines />
                        <ScatterGraph
                            data-bind="$page.bubbles"
                            selection={{ type: PropertySelection, multiple: true }}
                            sizeField="d"
                            colorIndex={0}
                        />
                    </Chart>
                </Svg>
                <div>
                    <Repeater records-bind="$page.bubbles">
                        <div>
                            <Checkbox
                                checked-bind="$record.selected"
                                text-bind="$record.name"
                            />
                        </div>
                    </Repeater>
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code1.tab" tab="controller" mod="code" text="Controller" />
                <Tab value-bind="$page.code1.tab" tab="chart" mod="code" text="Chart" default />

                <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="eINrAOlQ">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.set('$page.bubbles', Array.from({length: 15}).map((v, i)=>({
                                name: \`Bubble \${i+1}\`,
                                x: Math.random() * 100,
                                y: Math.random() * 100,
                                d: Math.random() * 40,
                                selected: i % 2 == 0
                            })));
                        }
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='chart'" fiddle="eINrAOlQ">{`
                    <div class="widgets" controller={PageController}>
                        <Svg style={{ width: "400px", height: "400px" }}>
                            <Chart anchors="0 1 1 0" offset="25 -25 -40 50" axes={NumericAxis.XY()}>
                                <Rectangle
                                    anchors="0 1 1 0"
                                    style={{ fill: "rgba(100, 100, 100, 0.1)" }}
                                />
                                <Gridlines />
                                <ScatterGraph
                                    data-bind="$page.bubbles"
                                    selection={{ type: PropertySelection, multiple: true }}
                                    sizeField="d"
                                    colorIndex={0}
                                />
                            </Chart>
                        </Svg>
                        <div>
                            <Repeater records-bind="$page.bubbles">
                                <div>
                                    <Checkbox
                                        checked-bind="$record.selected"
                                        text-bind="$record.name"
                                    />
                                </div>
                            </Repeater>
                        </div>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        The `Ctrl` key can be used to toggle bubble selection.

        Alternatively, the `toggle` property can be set to `true` and selection will behave same as if the `Ctrl` key is pressed all
        the time.

        This mode is usually used for multiple selection, but it can be used for single selection too.

        Property selection mode is very fast for checking if a particular object is selected, however, it needs to
        go through the whole list of objects to determine what is selected.

        ## Key Selection

        Key selection is a more common selection mode, where selected value(s) is/are stored in a separate variable.

        <CodeSplit>
            <div class="widgets">
                <Grid records-bind="$page.bubbles"
                    style={{ width: "400px" }}
                    columns={[
                        { header: 'Name', field: 'name' },
                        { header: 'X', field: 'x', format: 'n;2', align: "right" },
                        { header: 'Y', field: 'y', format: 'n;2', align: "right" },
                        { header: 'D', field: 'd', format: 'n;2', align: "right" }
                    ]}
                    selection={{ type: KeySelection, keyField: 'name', bind: '$page.selection' }}
                />
                <div>
                    <Select value-bind="$page.selection">
                        <Repeater records-bind="$page.bubbles">
                            <Option value-bind="$record.name" text-bind="$record.name" />
                        </Repeater>
                    </Select>
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code2.tab" mod="code" tab="index" text="Index" default />

                <CodeSnippet visible-expr="{$page.code2.tab}=='index'" fiddle="j8o4HZQV">{`
                    <Grid records-bind="$page.bubbles"
                            style={{width: "400px"}}
                            columns={[
                                { header: 'Name', field: 'name', sortable: true },
                                { header: 'X', field: 'x', sortable: true, format: 'n;2', align: "right" },
                                { header: 'Y', field: 'y', sortable: true, format: 'n;2', align: "right" },
                                { header: 'R', field: 'r', sortable: true, format: 'n;2', align: "right" }
                            ]}
                            selection={{type: KeySelection, keyField: 'name', bind: '$page.selection'}}
                    />
                    <div>
                        <Select value-bind="$page.selection">
                            <Repeater records-bind="$page.bubbles">
                                <Option value-bind="$record.name" text-bind="$record.name" />
                            </Repeater>
                        </Select>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Key selection works similar to `select` control where only key (value) of the selected option represents the
        selection.

        Use `keyField` or `keyFields` to configure which fields form the record key.

        Use `bind` property to define where selected keys will be stored.

        Use `multiple` property to decide if multiple selection is allowed or not.

        ## Simple Selection

        Simple selection is the simplest selection mode. It allows single selection only.

        <CodeSplit>
            <div class="widgets">
                <Grid records-bind="$page.bubbles"
                    style={{ width: "400px" }}
                    columns={[
                        { header: 'Name', field: 'name' },
                        { header: 'X', field: 'x', format: 'n;2', align: "right" },
                        { header: 'Y', field: 'y', format: 'n;2', align: "right" },
                        { header: 'D', field: 'd', format: 'n;2', align: "right" }
                    ]}
                    selection={{ type: SimpleSelection, bind: '$page.simpleSelection' }}
                />
                <div>
                    <Text tpl="Select a bubble" if-expr="!{$page.simpleSelection}" />
                    <Text
                        tpl="Selected bubble: {$page.simpleSelection.name}"
                        if-expr="{$page.simpleSelection}"
                    />
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code3.tab" mod="code" tab="index" text="Index" default />

                <CodeSnippet visible-expr="{$page.code3.tab}=='index'" fiddle="Tgt43PBJ">{`
                    <Grid records-bind="$page.bubbles"
                        style={{ width: "400px" }}
                        columns={[
                            { header: 'Name', field: 'name' },
                            { header: 'X', field: 'x', format: 'n;2', align: "right" },
                            { header: 'Y', field: 'y', format: 'n;2', align: "right" },
                            { header: 'D', field: 'd', format: 'n;2', align: "right" }
                        ]}
                        selection={{ type: SimpleSelection, bind: '$page.simpleSelection' }}
                    />
                    <div>
                        <Text tpl="Select a bubble" if-expr="!{$page.simpleSelection}" />
                        <Text
                            tpl="Selected bubble: {$page.simpleSelection.name}"
                            if-expr="{$page.simpleSelection}"
                        />
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Use `bind` property to define where selected objects will be stored.
    </Md>
</cx>;
