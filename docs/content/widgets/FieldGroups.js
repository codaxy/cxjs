import {HtmlElement, FieldGroup, TextField, Checkbox} from 'cx/widgets';
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

        The `FieldGroup` element is pure container element which allows disabling of multiple form elements using
        a single property. `ValidationGroup` widget may be used for this purpose too, under the hood, `FieldGroup`
        is just an alias for it.

        <CodeSplit>
            <div class="widgets">
                <Checkbox value:bind="$page.active">Disabled</Checkbox>
                <FieldGroup layout={LabelsLeftLayout} enabled:bind="$page.active">
                    <TextField label="First Name" value:bind="$page.firstName" required/>
                    <TextField label="Last Name" value:bind="$page.lastName" required/>
                </FieldGroup>
            </div>

            <CodeSnippet putInto="code" fiddle="Hw0NgP7R">{`
                <Checkbox value:bind="$page.active">Disabled</Checkbox>
                <FieldGroup layout={LabelsLeftLayout} enabled:bind="$page.active">
                    <TextField label="First Name" value:bind="$page.firstName" required/>
                    <TextField label="Last Name" value:bind="$page.lastName" required/>
                </FieldGroup>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

