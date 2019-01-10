import {HtmlElement, LinkButton} from 'cx/widgets';
import {Content} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import config from './configs/LinkButton';

export const LinkButtons = <cx>
    <Md>
        # LinkButton

        <ImportPath path="import {LinkButton} from 'cx/widgets';"/>

        Link buttons look like buttons and behave like [Links](~/widgets/links). `LinkButton` inherits `Button` options
        such as `confirm`, `icon` or `disabled` state.

        <CodeSplit>
            <div class="widgets">
                <LinkButton mod="primary" href="~/widgets/links">See Links</LinkButton>
                <LinkButton mod="danger" href="~/widgets/buttons">See Buttons</LinkButton>
            </div>
            <CodeSnippet putInto="code" fiddle="4WlDkLBS">{`
             <div class="widgets">
                <LinkButton mod="primary" href="~/widgets/links">See Links</LinkButton>
                <LinkButton mod="danger" href="~/widgets/buttons">See Buttons</LinkButton>
             </div>
         `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={config}/>

    </Md>
</cx>
