import {HtmlElement, Repeater, Select} from 'cx/widgets';
import {Content, LabelsLeftLayout} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/Select';

export const SelectFields = <cx>
    <Md>
        # Select

        <ImportPath path="import {Select} from 'cx/widgets';"/>

        <CodeSplit>

            The `Select` control is a wrapper around native HTML `select` element.
            In most cases, it's better to use [lookup fields](~/widgets/lookup-fields), as they provide more options,
            especially for multiple selection.

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <Select value:bind="$page.selection" label="Standard">
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                    </Select>
                    <Select value:bind="$page.selection" label="Disabled" disabled>
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                    </Select>
                    <Select value:bind="$page.selection2" label="Required" required placeholder>
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                    </Select>
                </div>
                <div layout={LabelsLeftLayout}>
                    <Select value:bind="$page.selection" label="Tooltip" tooltip="Tooltip">
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                    </Select>
                    <Select value:bind="$page.selection" label="Styled" inputStyle={{border: '1px solid green'}} icon="pencil">
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                    </Select>
                    <Select value:bind="$page.selection2" label="Clear" emptyValue={null} placeholder="Please select..." >
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                    </Select>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="hCnG2Ror">{`
            <div layout={LabelsLeftLayout}>
               <Select value:bind="$page.selection" label="Standard">
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
               </Select>
               <Select value:bind="$page.selection" label="Disabled" disabled>
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
               </Select>
               <Select value:bind="$page.selection" label="Required" required>
                  <option />
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
               </Select>
            </div>
            <div layout={LabelsLeftLayout}>
               <Select value:bind="$page.selection" label="Tooltip" tooltip="Tooltip">
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
               </Select>
               <Select value:bind="$page.selection" label="Styled" inputStyle={{border: '1px solid green'}} icon="pencil">
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
               </Select>
               <Select value:bind="$page.selection2" label="Clear" emptyValue={null} placeholder="Please select...">
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
               </Select>
            </div>
         `}</CodeSnippet>

        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
