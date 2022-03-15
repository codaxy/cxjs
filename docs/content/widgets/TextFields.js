import { Content, LabelsLeftLayout } from 'cx/ui';
import { Tab, TextField } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';
import { Md } from '../../components/Md';
import configs from './configs/TextField';

export const TextFields = <cx>
    <Md>
        # Text Field

        <ImportPath path="import {TextField} from 'cx/widgets';" />

        Text field control is used for single line textual inputs. It's one of the mostly used controls.
        Many different states make it an advanced control.

        <CodeSplit>

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <TextField label="Standard" value-bind="$page.text" autoFocus tabOnEnterKey />
                    <TextField label="Disabled" value-bind="$page.text" disabled />
                    <TextField label="Readonly" value-bind="$page.text" readOnly />
                    <TextField label="Placeholder" value-bind="$page.text" placeholder="Type something here..." />
                    <TextField label="Tooltip" value-bind="$page.text" tooltip='This is a tooltip.' />
                </div>
                <div layout={LabelsLeftLayout}>
                    <TextField label="Required" value-bind="$page.text" required trim />
                    <TextField label="Min/Max Length" value-bind="$page.text" minLength={3} maxLength={8} />
                    <TextField label="Styled" value-bind="$page.text"
                        inputStyle={{ border: '1px solid green' }}
                        icon="search"
                        showClear />
                    <TextField label="View" value-bind="$page.text" mode="view" tooltip="Tooltips are shown in view mode too." />
                    <TextField label="EmptyText" value-bind="$page.text" mode="view" emptyText="N/A" />
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="wrap" text="Index" default/>
                <CodeSnippet fiddle="drqgvlX1">{`
                <div layout={LabelsLeftLayout}>
                    <TextField label="Standard" value-bind="$page.text" autoFocus tabOnEnterKey />
                    <TextField label="Disabled" value-bind="$page.text" disabled />
                    <TextField label="Readonly" value-bind="$page.text" readOnly />
                    <TextField label="Placeholder" value-bind="$page.text" placeholder="Type something here..."/>
                    <TextField label="Tooltip" value-bind="$page.text" tooltip='This is a tooltip.'/>
                </div>
                <div layout={LabelsLeftLayout}>
                    <TextField label="Required" value-bind="$page.text" required trim />
                    <TextField label="Min/Max Length" value-bind="$page.text" minLength={3} maxLength={8}/>
                    <TextField label="Styled" value-bind="$page.text"
                        inputStyle={{border: '1px solid green'}}
                        icon="search"
                        showClear />
                    <TextField label="View" value-bind="$page.text" mode="view" tooltip="Tooltips are shown in view mode too."/>
                    <TextField label="EmptyText" value-bind="$page.text" mode="view" emptyText="N/A"/>
                </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Examples:

        * [Validation options](~/examples/form/validation-options)

        ## Configuration

        <ConfigTable props={configs} />

    </Md>
</cx>
