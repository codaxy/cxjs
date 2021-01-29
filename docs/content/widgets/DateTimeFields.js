import { Content, LabelsLeftLayout, LabelsTopLayout } from 'cx/ui';
import { HtmlElement, DateTimeField, DateField, TimeField } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';


import configs from './configs/DateField';

export const DateTimeFields = <cx>
    <Md>
        # DateTimeField

        <ImportPath path="import {DateTimeField} from 'cx/widgets';" />

        `DateTimeField` control is used for selecting date, time or date time values. It supports textual input and
        picking
        from a dropdown.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <DateTimeField label="Date & Time" value-bind="$page.date" />
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="oUVatu1E">{`
               <div layout={LabelsLeftLayout}>
                   <DateTimeField label="Date & Time" value-bind="$page.date" />
                </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        `DateTimeField` can be used to select only time or date segment of the date.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <DateTimeField label="Time" value-bind="$page.time" segment="time" />
                    <TimeField label="Time" value-bind="$page.time" />
                    <TimeField label="Time" value-bind="$page.time" picker="list" step={20} />
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="jCNZu1pp">{`
                <div layout={LabelsLeftLayout}>
                    <DateTimeField label="Time" value-bind="$page.time" segment="time" />
                    <TimeField label="Time" value-bind="$page.time" />
                    <TimeField label="Time" value-bind="$page.time" picker="list" step={20} />
                </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        > It's shorter to use `TimeField` alias which is more readable and sets `segment="time"`.

        It's possible to combine `DateField` and `TimeField` to edit the same value. Use `partial` flag
        to indicate that the field affects only one segment of the selected date.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <DateField label="Date" value-bind="$page.datetime" partial />
                    <TimeField label="Time" value-bind="$page.datetime" partial />
                </div>
                <div text-tpl="Selected: {$page.datetime:datetime}" />
            </div>

            <Content name="code">
                <CodeSnippet fiddle="bANd9ALo">{`
                <div layout={LabelsTopLayout}>
                    <DateField label="Date" value-bind="$page.datetime" partial />
                    <TimeField label="Time" value-bind="$page.datetime" partial />
                </div>
                <div text-tpl="Selected: {$page.datetime:datetime}" />
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={{
            ...configs,
            picker: {
                type: 'string',
                key: true,
                description: <cx><Md>
                    Modifies the appearance of dropdown into a list format. In this case `step` is also configurable.
                </Md></cx>
            }
        }}
        />

    </Md>
</cx>
