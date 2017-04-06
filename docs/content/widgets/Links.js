import { HtmlElement, Link } from 'cx/widgets';
import { Content } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import config from './configs/Link';

export const Links = <cx>
   <Md>
      # Links

      <ImportPath path="import {Link} from 'cx/widgets';" />

      Links are used for `pushState` navigation between pages.

      <CodeSplit>

         <div class="widgets">
               <Link href="~/widgets/link-buttons">Link Buttons</Link>
         </div>
         <CodeSnippet putInto="code" fiddle="navQfAlj">{`
             <div class="widgets">
                <Link href="~/widgets/link-buttons">Link Buttons</Link>
             </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={config} />
   </Md>
</cx>
