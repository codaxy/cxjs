import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Link} from 'cx/ui/nav/Link';

const properties = {
   href: {
      type: 'string',
      description: <cx><Md>
         Target url.
      </Md></cx>
   },
   disabled: {
      type: 'boolean',
      description: <cx><Md>
         Defaults to `false`. Set to `true` to disable the field.
      </Md></cx>
   }
};

export const Links = <cx>
   <Md>
      # Links
      Links are used for `pushState` navigation between pages.

      <CodeSplit>

         <div class="widgets">
               <Link href="~/widgets/text-fields">Text Fields</Link>
         </div>
         <CodeSnippet putInto="code">{`
             <div class="widgets">

             </div>
         `}</CodeSnippet>
      </CodeSplit>


      ## Configuration

      <ConfigTable props={properties} />

   </Md>
</cx>
