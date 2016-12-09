import { Content, ContentPlaceholder, Controller, LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout } from 'cx/ui';
import { HtmlElement, TextField, Checkbox, Select, LabeledContainer } from 'cx/widgets';
import { Debug } from 'cx/util';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';



//Debug.enable('should-update');
//Debug.enable('render');


export const ShouldUpdate = <cx>

   <div class="widgets">
      <TextField value:bind="$page.v1" />
      <TextField value:bind="$page.v1" />
   </div>

</cx>;

