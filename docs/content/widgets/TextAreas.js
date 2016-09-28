import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {TextArea} from 'cx/ui/form/TextArea';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/TextArea';

export const TextAreas = <cx>
   <Md>
      # Text Area

      The `TextArea` control is used for larger text inputs. Besides allowing multi-line input, it's practically
      the same as the `TextField` control.

      <CodeSplit>

         <div class="widgets">
            <div layout={LabelsLeftLayout}>
               <TextArea label="Standard" value:bind="$page.text" rows={5} autoFocus />
               <TextArea label="Disabled" value:bind="$page.text" disabled />
               <TextArea label="Readonly" value:bind="$page.text" readOnly />
               <TextArea label="Placeholder" value:bind="$page.text" placeholder="Type something here..." />
               <TextArea label="Tooltip" value:bind="$page.text" tooltip='This is a tooltip.' />
               <TextArea label="Required" value:bind="$page.text" required />
               <TextArea label="Styled" value:bind="$page.text" inputStyle={{border: '1px solid green'}} />
               <TextArea label="View" value:bind="$page.text" mode="view" />
               <TextArea label="EmptyText" value:bind="$page.text" mode="view" emptyText="N/A" />
            </div>
         </div>
         <CodeSnippet putInto="code">{`
            <div layout={LabelsLeftLayout}>
               <TextArea label="Standard" value:bind="$page.text" rows={5} autoFocus />
               <TextArea label="Disabled" value:bind="$page.text" disabled />
               <TextArea label="Readonly" value:bind="$page.text" readOnly />
               <TextArea label="Placeholder" value:bind="$page.text" placeholder="Type something here..." />
               <TextArea label="Tooltip" value:bind="$page.text" tooltip='This is a tooltip.' />
               <TextArea label="Required" value:bind="$page.text" required />
               <TextArea label="Styled" value:bind="$page.text" inputStyle={{border: '1px solid green'}} />
               <TextArea label="View" value:bind="$page.text" mode="view" />
               <TextArea label="EmptyText" value:bind="$page.text" mode="view" emptyText="N/A" />
            </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>