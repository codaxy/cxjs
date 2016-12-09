import { Content, ContentPlaceholder, Controller, LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout } from 'cx/ui';
import { HtmlElement, TextField, Checkbox, Select, LabeledContainer } from 'cx/widgets';
import { Debug } from 'cx/util';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';






export const Inferno = <cx>
   <div>
      <Md>
         # Inferno test

         312312312331232131233

         ### 123123

         <TextField value:bind="$page.text" />
         <TextField value:bind="$page.text"/>

         <ConfigTable props={{
            className: {
               key: true,
                description: 'X'
            }
         }} />

      </Md>
   </div>
</cx>;

