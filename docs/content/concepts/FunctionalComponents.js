import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';
import {Svg} from 'cx/svg';
import {Gridlines, LineGraph, Chart, NumericAxis} from 'cx/charts';
import {Content, Tab, TextField} from 'cx/widgets';
import {createFunctionalComponent, LabelsTopLayout, LabelsLeftLayout} from 'cx/ui';

import configs from '../widgets/configs/FunctionalComponent';

const LineChart = ({ data, chartStyle, lineStyle, areaStyle }) => <cx>
    <Svg style={chartStyle}>
        <Chart offset="20 -20 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
            <Gridlines/>
            <LineGraph data={data} lineStyle={lineStyle} areaStyle={areaStyle} area={areaStyle!=null} />
        </Chart>
    </Svg>
</cx>;

const MyForm = createFunctionalComponent(({vertical}) => {
    let layout = !vertical ? LabelsLeftLayout : { type: LabelsTopLayout, vertical: true };
    return <cx>
        <div layout={layout}>
            <TextField value-bind="$page.form.firstName" label="First Name" />
            <TextField value-bind="$page.form.lastName" label="Last Name" />
        </div>
    </cx>;
});



export const FunctionalComponents = <cx>
    <Md>
        <CodeSplit>

            # Functional Components

            CxJS offers functional components, similar to React. Functional components provide a simple way to
            create structures composed out of several CxJS components.

            In the following example, a new functional component is defined and then used to create multiple flavors of
            the same chart.

            <div class="widgets">
                <LineChart
                    chartStyle="width: 300px; height: 200px; background: white"
                    lineStyle="stroke: red; stroke-width: 1"
                    areaStyle="fill: rgba(255, 0, 0, 0.5)"
                    data={Array.from({length: 100}, (_, x) => ({ x, y: 75 - 50 * Math.random() }))}
                />

                <LineChart
                    chartStyle="width: 300px; height: 200px; background: black; color: gray"
                    lineStyle="stroke: lightgreen; stroke-width: 3"
                    data={Array.from({length: 100}, (_, x) => ({ x, y: 75 - 50 * Math.random() }))}
                />

                <LineChart
                    chartStyle="width: 300px; height: 200px; background: #2e2e4c; color: rgba(255, 255, 255, 0.7)"
                    lineStyle="stroke: currentColor; stroke-width: 2"
                    data={Array.from({length: 100}, (_, x) => ({ x, y: 75 - 50 * Math.random() }))}
                />
            </div>
            <Content name="code">
            <Tab value-bind="$page.code.tab" mod="code" tab="component" text="Component" default/>
            <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>

            <CodeSnippet visible-expr="{$page.code.tab}=='component'" fiddle="EjLrADci">{`
                //first define a component
                const LineChart = ({ data, chartStyle, lineStyle }) => <cx>
                    <Svg style={chartStyle}>
                        <Chart offset="20 -20 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                            <Gridlines/>
                            <LineGraph data={data} lineStyle={lineStyle} />
                        </Chart>
                    </Svg>
                </cx>;
            `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="EjLrADci">{`
                <div class="widgets">
                    <LineChart
                        chartStyle="width: 300px; height: 200px; background: white;"
                        lineStyle="stroke: red"
                        data={Array.from({length: 100}, (_, x) => ({ x, y: 75 - 50 * Math.random() }))}
                    />

                    <LineChart
                        chartStyle="width: 300px; height: 200px; background: black"
                        lineStyle="stroke: green; stroke-width: 1"
                        data={Array.from({length: 100}, (_, x) => ({ x, y: 75 - 50 * Math.random() }))}
                    />

                    <LineChart
                        chartStyle="width: 300px; height: 200px; background: blue"
                        lineStyle="stroke: white; stroke-width: 2"
                        data={Array.from({length: 100}, (_, x) => ({ x, y: 75 - 50 * Math.random() }))}
                    />
                </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Complex Functional Components

        <CodeSplit>

            <ImportPath path="import {createFunctionalComponent} from 'cx/ui';" />

            If functional components contain additional logic, it's required to wrap them inside a `createFunctionalComponent` call.

            <div class="widgets">
                <MyForm />
                <MyForm vertical />
            </div>
            <Content name="code">
            <Tab value-bind="$page.code2.tab" mod="code" tab="component" text="Component" default/>
            <Tab value-bind="$page.code2.tab" mod="code" tab="widget" text="Widget" default/>

            <CodeSnippet visible-expr="{$page.code2.tab}=='component'">{`
                const MyForm = createFunctionalComponent(({vertical}) => {
                    let layout = !vertical ? LabelsLeftLayout : { type: LabelsTopLayout, vertical: true };
                    return <cx>
                        <div layout={layout}>
                            <TextField value-bind="$page.form.firstName" label="First Name" />
                            <TextField value-bind="$page.form.lastName" label="Last Name" />
                        </div>
                    </cx>;
                });
            `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code2.tab}=='widget'">{`
                <div class="widgets">
                    <MyForm />
                    <MyForm vertical />
                </div>
            `}</CodeSnippet>
            </Content>

        </CodeSplit>

        > Note that React (functional) components can freely be mixed with CxJS, therefore, `createFunctionalComponent` is required
        when a CxJS functional component doesn't have a recognizable syntax.

        ### Reserved property names

        A number of properties that can be passed to functional components are important for the internal workings of the `Cx` framework. They ensure functional components work well
        with other `Cx` widgets, and **should not be used within the function body**. 

        <ConfigTable props={configs} />
    </Md>   
        
</cx>;

