import { HtmlElement, Icon } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Icon';


export const Icons = <cx>
    <Md>
        # Icons

        <ImportPath path="import {Icon} from 'cx/widgets';" />

        <CodeSplit>

            The `Icon` is used to render icons.

            <div class="widgets">
                <Icon name="calendar" />
                <Icon name="calculator" style="color:blue" />
                <Icon name="bug" style="background:yellow"/>
                <Icon name="pencil" />
            </div>

            <CodeSnippet putInto="code">{`
                <Icon name="calendar" />
                <Icon name="calculator" style="color:blue" />
                <Icon name="bug" style="background:yellow"/>
                <Icon name="pencil" />
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

        ## Registering Icons

        Cx includes only a couple of icons. Additional icon sets need to be registered.

        <CodeSplit>
        The following example shows how to register FontAwesome icon set.
            <CodeSnippet putInto="code">{`
            Icon.registerFactory((name, props) => {
                props = { ...props };
                props.className = \`fa fa-\${name} \${props.className || ''}\`;
                return <i {...props} />
            });
            `}</CodeSnippet>
        </CodeSplit>

        Individual icons can be registered using `Icon.register` method.

    </Md>
</cx>

