import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {ColorField} from 'cx/ui/form/ColorField';

export const ColorFields = <cx>
   <Md>
      # ColorField

      <CodeSplit>

         ColorPickers are used for selecting colors.

         <div class="widgets">
            <ColorField value={{bind:"$page.color", defaultValue:'#f88'}} autoFocus />
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

