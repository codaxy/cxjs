import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {MonthField} from 'cx/ui/form/MonthField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/Calendar';

export const MonthFields = <cx>
    <Md>
        # MonthField

        The `MonthField` widget is used for selecting months or month ranges.

        <CodeSplit>

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <MonthField range from:bind="$page.from" to:bind="$page.to" label="Range" autoFocus/>
                    <MonthField value:bind="$page.date" label="Single"/>
                </div>
            </div>

            <CodeSnippet putInto="code">{`
                <div layout={LabelsLeftLayout}>
                    <MonthField range from:bind="$page.from" to:bind="$page.to" label="Range" autoFocus/>
                    <MonthField value:bind="$page.date" label="Single"/>
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
