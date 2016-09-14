import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
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
//Debug.enable('should-update');
//Debug.enable('render');


export const ShouldUpdate = <cx>

   <div class="widgets">
      <TextField value:bind="$page.v1" />
      <TextField value:bind="$page.v1" />
   </div>

</cx>;

