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
            into React applications. It acts as a mediator between React and CxJS.

            <Content name="code">
                <Tab value="example" tab="example" text="ReactApp.js" mod="code" default />

                <CodeSnippet>{`
                    let store = new Store();
                    ...
                    // React
                    <div>
                        <Cx store={store} subscribe>
                            // CxJS widgets
                            <TextField value-bind="name" />
                        </Cx>
                        // React again
                        <button
                            onClick={(e) => {
                                alert("Hello " + store.get("name"));
                            }}
                        >
                            Say Hello
                        </button>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Injecting CxJS into React

        Since the `Cx` component contains mechanisms needed for rendering CxJS widgets,
        we can use e.g. `Button` or `Grid` in our React applications.

        1. Create a new [Store]("~/concepts/store") or use an existing one.

        2. Within the Cx component, we can use any CxJS widget.

        3. Access or manipulate data in the store to communicate with the CxJS widgets.

        ### Configuration
        <ConfigTable props={configs} />
    </Md>
</cx>