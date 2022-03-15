import {HtmlElement, FieldGroup, TextField, Checkbox, Button, Content, Tab} from 'cx/widgets';
import {LabelsLeftLayout} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/ValidationGroup';

export const FieldGroups = <cx>
    <Md>
        # FieldGroup

        <ImportPath path="import {FieldGroup} from 'cx/widgets';"/>

        <CodeSplit>

            The `FieldGroup` widget is pure container which allows disabling of multiple form elements using
            a single property. `ValidationGroup` widget may be used for this purpose too, under the hood, `FieldGroup`
            is just an alias for it.

            <div class="widgets">
                <Checkbox value-bind="$page.enabled">Enabled</Checkbox>
                <Checkbox value-bind="$page.readOnly">ReadOnly</Checkbox>
                <Checkbox value-bind="$page.viewMode">ViewMode</Checkbox>
                <FieldGroup
                    layout={LabelsLeftLayout}
                    enabled-bind="$page.enabled"
                    readOnly-bind="$page.readOnly"
                    viewMode-bind="$page.viewMode"
                    tabOnEnterKey
                >
                    <TextField label="First Name" value-bind="$page.firstName" required/>
                    <TextField label="Last Name" value-bind="$page.lastName" required/>
                    <Checkbox label="Status" value-bind="$page.active" text="Active" emptyText="Inactive" />
                    <Button text="Button" />
                </FieldGroup>
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="FieldGroups" default/>
                <CodeSnippet fiddle="Hw0NgP7R">{`
                    <Checkbox value-bind="$page.enabled">Enabled</Checkbox>
                    <Checkbox value-bind="$page.readOnly">ReadOnly</Checkbox>
                    <Checkbox value-bind="$page.viewMode">ViewMode</Checkbox>
                    <FieldGroup
                        layout={LabelsLeftLayout}
                        enabled-bind="$page.enabled"
                        readOnly-bind="$page.readOnly"
                        viewMode-bind="$page.viewMode"
                        tabOnEnterKey
                    >
                        <TextField label="First Name" value-bind="$page.firstName" required/>
                        <TextField label="Last Name" value-bind="$page.lastName" required/>
                        <Checkbox label="Status" value-bind="$page.active" text="Active" emptyText="Inactive" />
                        <Button text="Button" />
                    </FieldGroup>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

