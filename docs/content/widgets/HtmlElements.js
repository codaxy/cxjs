import { HtmlElement, ValidationGroup, Text, TextField, NumberField } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/HtmlElement';

export const HtmlElements = <cx>
   <Md>
      # HtmlElement

      <ImportPath path="import {HtmlElement} from 'cx/widgets';" />

      The `HtmlElement` widget is used to render HTML elements. All lowercase elements will be converted to the
      `HtmlElement` instances with the corresponding `tag` property set.

      <CodeSplit>

         <div class="widgets">
            <div style="width:200px" class="test">
               <h4>H4</h4>
               <p>Paragraph</p>
               <span>Span</span>
               <hr />
               <br />
               <input type="text" onRef={(el) => { console.log(el) }} />
            </div>
         </div>

         <CodeSnippet putInto="code" fiddle="f8sxjeG9">{`
            <div style="width:200px" class="test">
               <h4>H4</h4>
               <p>Paragraph</p>
               <span>Span</span>
               <hr />
               <br />
               <input type="text" onRef={(el) => { console.log(el) }}  />
            </div>
         `}</CodeSnippet>
      </CodeSplit>

      All HTML attributes and events will be passed to the element. Cx specific attributes, such as `visible`, `layout`,
      `controller`, `outerLayout` and `items` work as expected.

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>
