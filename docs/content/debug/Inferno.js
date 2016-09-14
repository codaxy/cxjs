import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {Content} from 'cx/ui/layout/Content';
import {ContentPlaceholder} from 'cx/ui/layout/ContentPlaceholder';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Select} from 'cx/ui/form/Select';
import {LabeledContainer} from 'cx/ui/form/LabeledContainer';

import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {LabelsTopLayout} from 'cx/ui/layout/LabelsTopLayout';
import {FirstVisibleChildLayout} from 'cx/ui/layout/FirstVisibleChildLayout';

import {Debug} from 'cx/util/Debug';



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

