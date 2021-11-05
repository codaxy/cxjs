import { HtmlElement, LabeledContainer, TextField, DateField } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/LabeledContainer';

export const LabeledContainers = <cx>
   <Md>
      # LabeledContainer

      <ImportPath path="import {LabeledContainer} from 'cx/widgets';" />


      <CodeSplit>

         The `LabeledContainer` widget is used in combination with `LabelsLeftLayout` to group multiple items under the
         same label.

         <div class="widgets">
            <div layout={LabelsLeftLayout}>
               <LabeledContainer label="Name" trimWhitespace={false}>
                  <TextField value-bind="$page.person.firstName" placeholder="First Name" />
                  <TextField value-bind="$page.person.lastName" placeholder="Last Name" />
               </LabeledContainer>
               <LabeledContainer label="Origin" trimWhitespace={false}>
                  <DateField value-bind="$page.person.dob" placeholder="DOB" />
                  <TextField value-bind="$page.person.country" placeholder="Country" />
               </LabeledContainer>
            </div>
         </div>

         <CodeSnippet putInto="code" fiddle="Ax68dwot">{`
            <div layout={LabelsLeftLayout}>
               <LabeledContainer label="Name" trimWhitespace={false}>
                  <TextField value-bind="$page.person.firstName" placeholder="First Name" />
                  <TextField value-bind="$page.person.lastName" placeholder="Last Name" />
               </LabeledContainer>
               <LabeledContainer label="Origin" trimWhitespace={false}>
                  <DateField value-bind="$page.person.dob" placeholder="DOB" />
                  <TextField value-bind="$page.person.country" placeholder="Country" />
               </LabeledContainer>
            </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />
   </Md>
</cx>

