import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {ValidationGroup} from 'cx/ui/form/ValidationGroup';
import {Text} from 'cx/ui/Text';
import {TextField} from 'cx/ui/form/TextField';
import {NumberField} from 'cx/ui/form/NumberField';

import configs from './configs/PureContainer';

export const PureContainer = <cx>
   <Md>
      # PureContainer

      <ImportPath path={"import \{PureContainer\} from 'cx/ui/PureContainer';"}></ImportPath>

      The `PureContainer` component does not render a top-level HTML element and therefore doesn't have any visual
      attributes. It outputs its children, however, the container provides a good place to control
      group level features such as layout or visibility.

      The `PureContainer` class is commonly used as a base class for other widgets such as:

      * `ValidationGroup` - form validation
      * `Repeater` - repeatable content
      * `Route` - visible only if current URL matches the specified route (template)

      <CodeSplit>

         <div class="widgets">
            <ValidationGroup layout={LabelsLeftLayout} invalid:bind="$page.invalid">
               <TextField label="Text" value:bind="$page.text" required />
               <NumberField label="Number" value:bind="$page.number" required minValue={10} />
               <Text value="Please correct the errors." visible:bind="$page.invalid" />
            </ValidationGroup>
         </div>

         <CodeSnippet putInto="code">{`
            <ValidationGroup layout={LabelsLeftLayout} invalid:bind="$page.invalid">
               <TextField label="Text" value:bind="$page.text" required />
               <NumberField label="Number" value:bind="$page.number" required minValue={10} />
               <Text value="Please correct the errors." visible:bind="$page.invalid" />
            </ValidationGroup>
         `}</CodeSnippet>
      </CodeSplit>

      In the example above, the `ValidationGroup` widget is used to arrange elements into a horizontal form layout and to
      track if all fields are in a valid state.

      ## Configuration

      <ConfigTable props={{...configs, mod: false}} />

   </Md>
</cx>

