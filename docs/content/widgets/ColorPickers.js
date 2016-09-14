import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {ColorPicker} from 'cx/ui/form/ColorPicker';

export const ColorPickers = <cx>
   <Md>
      # ColorPicker

      <CodeSplit>

         ColorPickers are used for selecting colors.

         <div class="widgets">
            <ColorPicker value:bind="$page.color"/>
            <div style={{width:'100px', height: '70px', background:{bind:'$page.color'}}}></div>
         </div>

         <CodeSnippet putInto="code">{`
             <div class="widgets">

             </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={{}} />

   </Md>
</cx>

