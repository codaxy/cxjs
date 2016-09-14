import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {ValidationGroup} from 'cx/ui/form/ValidationGroup';
import {TextField} from 'cx/ui/form/TextField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/ValidationGroup';


export const ValidationGroups = <cx>
   <Md>
      # ValidationGroup

      <CodeSplit>

         The `ValidationGroup` element is pure container element which allows tracking the state of the form.
         If any of the fields inside it reports a validation error, invalid state is reported to the data store.

         <div class="widgets" style={{
               borderLeftWidth: '3px',
               borderLeftStyle: 'solid',
               borderLeftColor: { expr: '{$page.valid} ? "lightgreen" : "red"' }
            }}>
            <ValidationGroup layout={LabelsLeftLayout} valid:bind="$page.valid">
               <TextField label="First Name" value:bind="$page.firstName" required />
               <TextField label="Last Name" value:bind="$page.lastName" required />
            </ValidationGroup>
         </div>

         <CodeSnippet putInto="code">{`
            <div class="widgets" style={{
               borderLeftWidth: '3px',
               borderLeftStyle: 'solid',
               borderLeftColor: { expr: '{$page.valid} ? "lightgreen" : "red"' }
            }}>
            <ValidationGroup layout={LabelsLeftLayout} valid:bind="$page.valid">
               <TextField label="First Name" value:bind="$page.firstName" required />
               <TextField label="Last Name" value:bind="$page.lastName" required />
            </ValidationGroup>
         </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

