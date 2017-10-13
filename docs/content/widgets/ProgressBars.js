import { HtmlElement, ProgressBar, Slider } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/ProgressBar';

export const ProgressBars = <cx>
   <Md>
      # ProgressBar

      <ImportPath path="import {ProgressBar} from 'cx/widgets';" />

      The `PureContainer` component provides a place to control layout or visibility for all of its children.
       The component itself doesn't render any markup and therefore doesn't have any visual
      attributes.

      The `PureContainer` class is commonly used as a base class for other widgets such as:

      * `ValidationGroup` - form validation
      * `Repeater` - repeatable content
      * `Route` - visible only if current URL matches the specified route (template)

      <CodeSplit>

         <div class="widgets">
            <ProgressBar disabled text="Loading..." icon="edit" value:bind='$page.value' />
            <Slider value:bind='$page.value' maxValue={1} />
         </div>

         <CodeSnippet putInto="code" fiddle="IsLloM4H">{`
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

