import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {ColorPicker} from 'cx/ui/form/ColorPicker';

import configs from './configs/ColorFiel';

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
            <ColorPicker value:bind="$page.color"/>
            <div style={{width:'100px', height: '70px', background:{bind:'$page.color'}}}>
             </div>
         `}</CodeSnippet>
      </CodeSplit>
         
        > Use 'Mouse Cursor' to navigate through the ColorPicker. Use the color range pool on the top right corner to
        choose a color. You can do the same by entering values for H, S and L in the respective fields or R, G and B
        similarly. The pool field below is used for selecting alpha channel, which you can also select by specifying
        the value in the A field.
        
        > Use the color pool on the left side of the picker to choose the shade of the color. H and A values are fixed,
        while you change the values for S and L.
         

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

