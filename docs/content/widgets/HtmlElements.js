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

      The `HtmlElement` widget is used for rendering HTML elements. All lowercase elements will be converted to the
      `HtmlElement` instances with corresponding `tag` property set.

      <CodeSplit>

         <div class="widgets">
            <div style="width:200px" class="test">
               <h4>H4</h4>
               <p>Paragraph</p>
               <span>Span</span>
               <hr />
               <br />
               <input type="text" />
            </div>
         </div>

         <CodeSnippet putInto="code">{`
            <div style="width:200px" class="test">
               <h4>H4</h4>
               <p>Paragraph</p>
               <span>Span</span>
               <hr />
               <br />
               <input type="text" />
            </div>
         `}</CodeSnippet>
      </CodeSplit>

      All HTML attributes and events will be passed to the element. Cx specific attributes, such as `visible`, `layout`,
      `controller`, `outerLayout`, `items` work as expected.

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

