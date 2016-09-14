import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {ContentPlaceholder} from 'cx/ui/layout/ContentPlaceholder';

import {Repeater} from 'cx/ui/Repeater';
import {NumberField} from 'cx/ui/form/NumberField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Select} from 'cx/ui/form/Select';
import {LabeledContainer} from 'cx/ui/form/LabeledContainer';

import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {LabelsTopLayout} from 'cx/ui/layout/LabelsTopLayout';
import {FirstVisibleChildLayout} from 'cx/ui/layout/FirstVisibleChildLayout';

import {Debug} from 'cx/util/Debug';

export const RepeaterCache = <cx>

   <div class="widgets">
      <NumberField value:bind="$page.v" />
      <Repeater records={Array.from({length: 10}).map(()=>({}))}>
         <div visible:expr="{$index} < {$page.v}">
            <Repeater records={Array.from({length: 10}).map(()=>({}))}>
               <div visible:expr="{$index} < {$page.v}">
                  <div text:tpl="{$index}" />
               </div>
            </Repeater>
         </div>
      </Repeater>
   </div>

</cx>;

