import { HtmlElement, Link, Tab } from 'cx/widgets';
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
         <Content name="code">
            <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Links" default/>
            <CodeSnippet fiddle="navQfAlj">{`
               <div class="widgets">
                  <Link href="~/widgets/link-buttons">Link Buttons</Link>
               </div>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={config} />
   </Md>
</cx>
