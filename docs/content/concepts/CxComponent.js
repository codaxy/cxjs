import { Content, Tab } from 'cx/widgets';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { CodeSplit } from 'docs/components/CodeSplit';
import { Md } from 'docs/components/Md';
import { ConfigTable } from '../../components/ConfigTable';
import configs from './configs/CxComponent';

export const CxComponent = <cx>
    <Md>
        # Cx Component

        > Prerequisite: [Widgets](/concepts/widgets)

        <CodeSplit>
            The `Cx` component is a React component designed to integrate CxJS widgets
            into a React application. It acts as a mediator between React and CxJS.

            <Content name="code">
                <Tab value="example" tab="example" text="startAppLoop.js" mod="code" default />

                <CodeSnippet>{`
                    let root = <Cx
                        store={store}
                        widget={widget}
                        instance={instance}
                        parentInstance={parentInstance}
                        options={options}
                        subscribe
                    />;
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Injecting CxJS into React
        Since the `Cx` component contains mechanisms needed for rendering CxJS widgets,
        we can use e.g. `Button` or `Grid` in our React applications.

        1. First we need to install CxJS and its dependencies in our project. It can be
        done running the `npm install cx` command.

        2. In the application's entry point, invoke `startAppLoop()` to begin processing
        and rendering CxJS components. That method accepts a parent's `DOM element` which
        contains the whole application, a `Store` or an `Instance` object, and the
        component that we want to render.

        3. Finally, we can import widgets that we want to use.
        CxJS processes its own code internally within the framework, employing its
        own tree traversal logic and store management. When widgets are encountered,
        CxJS processes them and generates a **virtual DOM** (**VDOM**) representation.
        This VDOM is then seamlessly integrated into React's rendering process.

        ### Configuration
        <ConfigTable props={configs} />
    </Md>
</cx>