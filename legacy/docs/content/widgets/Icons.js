import { Content, Icon, Tab } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';
import { Md } from '../../components/Md';
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
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="wrap" text="Index" default/>
                <CodeSnippet fiddle="6aQAwn3B">{`
                    <Icon name="calendar" />
                    <Icon name="calculator" style="color:blue" />
                    <Icon name="bug" style="background:yellow"/>
                    <Icon name="pencil" />
                `}</CodeSnippet>
            </Content>
            
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

        ## Registering Icons

        Cx includes only a couple of icons. Additional icon sets need to be registered.

        <CodeSplit>
        The following example shows how to register FontAwesome icon set.
        <Content name="code">
        <Tab value-bind="$page.code2.tab" mod="code" tab="wrap" text="registerFactory" default/>

            <CodeSnippet>{`
            Icon.registerFactory((name, props) => {
                props = { ...props };
                props.className = \`fa fa-\${name} \${props.className || ''}\`;
                return <i {...props} />
            });
            `}</CodeSnippet>
        </Content>
        </CodeSplit>

        Individual icons can be registered using `Icon.register` method.

    </Md>
</cx>

