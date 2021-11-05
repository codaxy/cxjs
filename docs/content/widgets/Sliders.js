import { HtmlElement, Slider, PrivateStore, IsolatedScope } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Slider';


export const Sliders = <cx>
    <Md>
        # Slider

        <ImportPath path="import {Slider} from 'cx/widgets';" />

        The `Slider` widget allow selecting numerical values by dragging the slider handle.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <Slider
                        label="Standard"
                        value-bind="$page.to"
                        valueTooltip={{
                            text:{tpl: '{$page.to:n;2}' },
                            placement: 'up'
                        }}
                        wheel
                        increment={2.5}
                        tooltip="This is a slider tooltip."
                    />
                    <Slider label="Stepped" from-bind="$page.from" step={10} wheel increment={10} />
                    <Slider label="Range" from-bind="$page.from" to-bind="$page.to" />
                    <Slider label="Disabled" from-bind="$page.from" to-bind="$page.to" disabled />
                </div>
                <Slider vertical from-bind="$page.from" to-bind="$page.to" step={10} rangeStyle="background:lightsteelblue"/>
                <Slider vertical from-bind="$page.from" to-bind="$page.to" rangeStyle="background:lightgreen"/>
                <Slider vertical from-bind="$page.from" to-bind="$page.to" rangeStyle="background:lightyellow"/>
            </div>

            <CodeSnippet putInto="code" fiddle="NvE9CD9C">{`
                <div layout={LabelsLeftLayout}>
                    <Slider label="Standard" value-bind="$page.to" valueTooltip={{
                            text:{tpl: '{$page.to:n;2}' },
                            placement: 'up'
                        }}
                        wheel
                        increment={2.5} />
                    <Slider label="Stepped" from-bind="$page.from" step={10} wheel increment={10} />
                    <Slider label="Range" from-bind="$page.from" to-bind="$page.to" />
                    <Slider label="Disabled" from-bind="$page.from" to-bind="$page.to" disabled />
                </div>
                <Slider vertical from-bind="$page.from" to-bind="$page.to" step={10} rangeStyle="background:lightsteelblue"/>
                <Slider vertical from-bind="$page.from" to-bind="$page.to" rangeStyle="background:lightgreen"/>
                <Slider vertical from-bind="$page.from" to-bind="$page.to" rangeStyle="background:lightyellow"/>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

