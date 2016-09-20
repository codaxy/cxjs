import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Slider} from 'cx/ui/form/Slider';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/slider';


export const Sliders = <cx>
    <Md>
        # Slider

        The `Slider` widget allow selecting numerical values by dragging the slider handle.

        <CodeSplit>

            <div class="widgets" layout={LabelsLeftLayout}>
                <Slider label="Standard" value:bind="$page.to" />
                <Slider label="Step" value:bind="$page.to" step={10} tooltip={{text:{tpl: '{$page.value:n}', trackMouse: true}}}/>
                <Slider label="Step" from:bind="$page.from" to:bind="$page.to" step={10} tooltip={{text:{tpl: '{$page.value:n}', trackMouse: true}}}/>
            </div>

            <CodeSnippet putInto="code">{`
            <div class="widgets" layout={LabelsLeftLayout}>
                <Slider label="Standard" value:bind="$page.to" />
                <Slider label="Step" value:bind="$page.to" step={10} tooltip={{text:{tpl: '{$page.value:n}', trackMouse: true}}}/>
                <Slider label="Step" from:bind="$page.from" to:bind="$page.to" step={10} tooltip={{text:{tpl: '{$page.value:n}', trackMouse: true}}}/>
            </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

