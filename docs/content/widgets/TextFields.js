import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {TextField} from 'cx/ui/form/TextField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/TextField';

export const TextFields = <cx>
    <Md>
        # Text Field

        <ImportPath path={"import \{TextField\} from 'cx/ui/form/TextField';"}></ImportPath>

        Text field control is used for text input. It's one of the most used controls.
        Many different states make it an advanced control.

        <CodeSplit>


            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <TextField label="Standard" value:bind="$page.text" autoFocus/>
                    <TextField label="Disabled" value:bind="$page.text" disabled/>
                    <TextField label="Readonly" value:bind="$page.text" readOnly/>
                    <TextField label="Placeholder" value:bind="$page.text" placeholder="Type something here..."/>
                    <TextField label="Tooltip" value:bind="$page.text" tooltip='This is a tooltip.'/>
                </div>
                <div layout={LabelsLeftLayout}>
                    <TextField label="Required" value:bind="$page.text" required/>
                    <TextField label="Min/Max Length" value:bind="$page.text" minLength={3} maxLength={8}/>
                    <TextField label="Styled" value:bind="$page.text" inputStyle={{border: '1px solid green'}} icon="search"/>
                    <TextField label="View" value:bind="$page.text" mode="view"/>
                    <TextField label="EmptyText" value:bind="$page.text" mode="view" emptyText="N/A"/>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
               <div layout={LabelsLeftLayout}>
                  <TextField label="Standard" value:bind="$page.text" autoFocus />
                  <TextField label="Disabled" value:bind="$page.text" disabled />
                  <TextField label="Readonly" value:bind="$page.text" readOnly />
                  <TextField label="Placeholder" value:bind="$page.text" placeholder="Type something here..." />
               </div>
               <div layout={LabelsLeftLayout}>
                  <TextField label="Required" value:bind="$page.text" required />
                  <TextField label="Styled" value:bind="$page.text" inputStyle={{border: '1px solid green'}} />
                  <TextField label="View" value:bind="$page.text" mode="view" />
                  <TextField label="EmptyText" value:bind="$page.text" mode="view" emptyText="N/A" />
               </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Examples:

        * [Validation options](~/examples/form/validation-options)

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>