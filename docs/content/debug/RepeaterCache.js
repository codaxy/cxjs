import { HtmlElement, Repeater, NumberField, Checkbox, Select, LabeledContainer } from 'cx/widgets';
import { Content, ContentPlaceholder, LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout } from 'cx/ui';
import { Debug } from 'cx/util';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';





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

