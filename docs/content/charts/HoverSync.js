import { Bar, CategoryAxis, Chart, ColorMap, Gridlines, Legend, LegendEntry, NumericAxis, PieChart, PieSlice } from 'cx/charts';
import { Svg } from 'cx/svg';
import { Controller, HoverSync, KeySelection, HoverSyncElement } from 'cx/ui';
import { Grid, Repeater } from 'cx/widgets';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { CodeSplit } from 'docs/components/CodeSplit';
import { ImportPath } from 'docs/components/ImportPath';
import { Md } from 'docs/components/Md';

class PageController extends Controller {
    onInit() {
        let value = 100;
        this.store.set('$page.points', Array.from({ length: 7 }, (_, i) => ({
            id: i,
            name: 'Item ' + (i + 1),
            value: value = (value + (Math.random() - 0.5) * 30),
        })));
    }
}

export const HoverSyncPage = <cx>
    <Md>
        <CodeSplit>
            # HoverSync

         <ImportPath path="import { HoverSync, HoverSyncElement } from 'cx/ui';" />

         The `HoverSync` component is used to enable hover synchronization between its descendants. This is commonly used to
         synchronize highlight hover effects in chart elements, chart legends and data grids. Each component that participates in hover sync
         should define the `hoverId` parameter to indicate a unique identifier used to identify the same record in multiple places.
          In case that separate groups of components should synchronize independently, you can specify the `hoverChannel`
          parameter to put the component in a separate group. Default value is `default`. The `HoverSyncElement` component can be used
          to implement hover effect on a group of widgets. It will render a `div` or a `g` element with `cxs-hover` class that can be
          used to style descendant element. Alternatively, the element itself can be styled using the `hoverStyle` and `hoverClass` attributes.

         <div class="widgets" controller={PageController}>
                <HoverSync>
                    <Legend />
                    <div>
                        <Svg style="width:600px; height:300px;">
                            <ColorMap />
                            <PieChart angle={360} anchors="0 0.5 1 0">
                                <Repeater
                                    records-bind="$page.points"
                                    sortField-bind="$page.sortField"
                                    sortDirection-bind="$page.sortDir"
                                >
                                    <PieSlice
                                        value-bind='$record.value'
                                        colorMap="pie"
                                        r={80}
                                        r0={50}
                                        offset={5}
                                        hoverId-bind="$record.id"
                                        innerPointRadius={80}
                                        outerPointRadius={90}
                                        name-bind="$record.name"
                                        selection={{
                                            type: KeySelection,
                                            bind: '$page.selection',
                                            records: { bind: '$page.points' },
                                            record: { bind: '$record' },
                                            index: { bind: '$index' },
                                            keyField: 'id'
                                        }}
                                    />
                                </Repeater>
                            </PieChart>

                            <Chart
                                anchors="0 1 1 0.5"
                                offset="10 -10 -20 50"
                                axes={{
                                    x: { type: NumericAxis, snapToTicks: 0 },
                                    y: { type: CategoryAxis, vertical: true, snapToTicks: 1, inverted: true }
                                }}
                            >
                                <Gridlines />
                                <Repeater
                                    records-bind="$page.points"
                                    sortField-bind="$page.sortField"
                                    sortDirection-bind="$page.sortDir"
                                >
                                    <Bar
                                        name-bind="$record.name"
                                        x-bind="$record.value"
                                        y-bind="$record.name"
                                        colorMap="pie"
                                        hoverId-bind="$record.id"
                                        size={0.5}
                                        selection={{
                                            type: KeySelection,
                                            bind: '$page.selection',
                                            records: { bind: '$page.points' },
                                            record: { bind: '$record' },
                                            index: { bind: '$index' },
                                            keyField: 'id'
                                        }}
                                    />
                                </Repeater>
                            </Chart>
                        </Svg>
                    </div>
                    <Grid
                        records-bind="$page.points"
                        style="width: 200px"
                        sortField-bind="$page.sortField"
                        sortDirection-bind="$page.sortDir"
                        columns={[{
                            field: 'name',
                            pad: false,
                            header: "Item",
                            sortable: true,
                            items: <cx>
                                <LegendEntry
                                    name-bind="$record.name"
                                    colorMap="pie"
                                    selection={{
                                        type: KeySelection,
                                        bind: '$page.selection',
                                        records: { bind: '$page.points' },
                                        record: { bind: '$record' },
                                        index: { bind: '$index' },
                                        keyField: 'id'
                                    }}
                                    size={10}
                                    shape='circle'
                                />
                                <span text-bind="$record.name" />
                            </cx>
                        },
                        { field: 'value', header: 'Value', format: "n;2", align: "right", sortable: true }
                        ]}
                        selection={{
                            type: KeySelection,
                            bind: '$page.selection',
                            keyField: 'id'
                        }}
                        rowHoverId-bind="$record.id"
                    />
                    <div>
                        <Repeater records-bind="$page.points">
                            <HoverSyncElement
                                hoverId-bind="$record.id"
                                style="padding: 4px 10px; background: #eee; border: 1px solid; border-color: transparent; margin: 2px"
                                hoverStyle="border-color: gray"
                            >
                                <div text-tpl="{$record.name}" />
                            </HoverSyncElement>
                        </Repeater>
                    </div>
                </HoverSync>
            </div>

            <CodeSnippet putInto="code" fiddle="Diim11Hb">{`
         <HoverSync>
            <Legend />
            <div>
               <Svg style="width:600px; height:300px;">
                  <ColorMap />
                  <PieChart angle={360} anchors="0 0.5 1 0">
                     <Repeater
                        records-bind="$page.points"
                        sortField-bind="$page.sortField"
                        sortDirection-bind="$page.sortDir"
                     >
                        <PieSlice
                            value-bind='$record.value'
                            colorMap="pie"
                            r={80}
                            r0={20}
                            offset={5}
                            hoverId-bind="$record.id"
                            innerPointRadius={80}
                            outerPointRadius={90}
                            name-bind="$record.name"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selection',
                                records: {bind: '$page.points'},
                                record: {bind: '$record'},
                                index: {bind: '$index'},
                                keyField: 'id'
                            }}
                        />
                     </Repeater>
                  </PieChart>

                  <Chart
                     anchors="0 1 1 0.5"
                     offset="10 -10 -20 50"
                     axes={{
                        x: { type: NumericAxis, snapToTicks: 0 },
                        y: { type: CategoryAxis, vertical: true, snapToTicks: 1, inverted: true }
                     }}
                  >
                     <Gridlines />
                     <Repeater
                        records-bind="$page.points"
                        sortField-bind="$page.sortField"
                        sortDirection-bind="$page.sortDir"
                     >
                        <Bar
                           name-bind="$record.name"
                           x-bind="$record.value"
                           y-bind="$record.name"
                           colorMap="pie"
                           hoverId-bind="$record.id"
                           size={0.5}
                           selection={{
                              type: KeySelection,
                              bind: '$page.selection',
                              records: {bind: '$page.points'},
                              record: {bind: '$record'},
                              index: {bind: '$index'},
                              keyField: 'id'
                           }}
                        />
                     </Repeater>
                  </Chart>
               </Svg>
            </div>
            <Grid
               records-bind="$page.points"
               style="width: 200px"
               sortField-bind="$page.sortField"
               sortDirection-bind="$page.sortDir"
               columns={[{
                  field: 'name',
                  pad: false,
                  header: "Item",
                  sortable: true,
                  items: <cx>
                     <LegendEntry
                        name-bind="$record.name"
                        colorMap="pie"
                        selection={{
                             type: KeySelection,
                             bind: '$page.selection',
                             records: {bind: '$page.points'},
                             record: {bind: '$record'},
                             index: {bind: '$index'},
                             keyField: 'id'
                        }}
                        size={10}
                        shape='circle'
                      />
                      <span text-bind="$record.name" />
                  </cx>},
                  { field: 'value', header: 'Value', format: "n;2", align: "right", sortable: true }
               ]}
               selection={{
                  type: KeySelection,
                  bind: '$page.selection',
                  keyField: 'id'
               }}
               rowHoverId-bind="$record.id"
            />
            <div>
                <Repeater records-bind="$page.points">
                    <HoverSyncElement
                        hoverId-bind="$record.id"
                        style="padding: 4px 10px; background: #eee; border: 1px solid; border-color: transparent; margin: 2px"
                        hoverStyle="border-color: gray"
                    >
                        <div text-tpl="{$record.name}" />
                    </HoverSyncElement>
                </Repeater>
            </div>
         </HoverSync>
         `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>

