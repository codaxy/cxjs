import { HtmlElement, MonthField, Tab } from 'cx/widgets';
import { Content, LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/MonthField';

export const MonthFields = <cx>
    <Md>
        # MonthField

        <ImportPath path="import {MonthField} from 'cx/widgets';" />

        The `MonthField` widget is used for selecting months or month ranges.

        <CodeSplit>

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <MonthField range from-bind="$page.from" to-bind="$page.to" label="Range" autoFocus/>
                    <MonthField value-bind="$page.date" label="Single"/>
                </div>
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="MonthField" default/>
                <CodeSnippet fiddle="3Tm7m9Cz">{`
                    <div layout={LabelsLeftLayout}>
                        <MonthField range from-bind="$page.from" to-bind="$page.to" label="Range" autoFocus/>
                        <MonthField value-bind="$page.date" label="Single"/>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
