import { Content, Tab } from 'cx/widgets';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { CodeSplit } from 'docs/components/CodeSplit';
import { Md } from 'docs/components/Md';

export const CxComponent = <cx>
    <Md>
        # Cx Component

        > Prerequisite: [Widgets](/concepts/widgets)

        <CodeSplit>
            In CxJS, the `Cx` component is the root component used to define and render the
            structure of a CxJS application. The `Cx` component typically serves as the
            top-level container for the application, wrapping all other CxJS components.

            <Content name="code">
                <Tab value="example" tab="example" text="Example" mod="code" default />

                <CodeSnippet>{`
                    <cx>
                        <h4>Click the button</h4>
                        <Button text="Click" />
                    </cx>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Injecting CxJS into React
        Since the `Cx` component contains the `store` and other mechanisms needed for
        rendering CxJS components, it can be used inside React applications. That means we
        can also use CxJS widgets, e.g. `Button` or `Grid`, in our React applications.

        Let's say we have a React application in which we want to use some CxJS widgets.

        1. First we need to install CxJS and its dependencies in our project. It can be
        done running the `npm install cx` command.

        2. In the application's entry point, invoke `startAppLoop()` to begin processing
        and rendering CxJS components. That method accepts a parent's `DOM element` which
        contains the whole application, a `Store` or an `Instance` object, and the
        component that we want to render.

        3. CxJS processes its own code internally within the framework, employing its
        own tree traversal logic and store management. When components are encountered
        within `cx` tags, `Cx` processes them and generates a **virtual DOM** (**VDOM**)
        representation. This VDOM is then seamlessly integrated into React's rendering
        process.

        <CodeSplit>
            4. Finally, we can import widgets that we want to use, and use them within `cx`
            tags.

            <Content name="code">
                <Tab value="example" tab="example" text="Example" mod="code" default />

                <CodeSnippet>{`
                    export const ReactApp = () => {
                        return (
                            <cx>
                                <TextField label-"Name" value-bind="$page.name" />
                            </cx>
                        );
                    }
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        > Keep in mind that CxJS widgets need to be enclosed within `cx` tags, like in
        the example above. Everything outside is React code and would produce different
        results.
    </Md>
</cx>