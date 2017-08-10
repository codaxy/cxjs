import { HtmlElement, Checkbox, TextField, Text } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';



export const GettingStarted = <cx>
    <Md>
        # Getting Started

        ## Basic Concepts

        It is very important to understand syntax and how data-binding works.

        Cx uses JSX syntax, [introduced by React](https://facebook.github.io/react/docs/introducing-jsx.html),
        which enables HTML/XML-like structures inside JavaScript.
        On top of JSX syntax, Cx uses custom data binding instructions to connect widgets with the
        underlying data store.

        <CodeSplit>

            Check out the following example:

            <TextField value:bind="name" placeholder="What's your name?" />

            <p visible:expr="{name}!=null" preserveWhitespace>
                Hi <strong text:bind="name" />!
                Did you know that your name contains exactly <Text expr="{name}.length" /> letters?
            </p>

            <CodeSnippet putInto="code" fiddle="5sKUUw0A">{`

            <TextField value:bind="name" placeholder="What's your name?" />

            <p visible:expr="{name}!=null" preserveWhitespace>
                Hi <strong text:bind="name" />!
                Did you know that your name contains exactly <Text expr="{name}.length" /> letters?
            </p>

            `}</CodeSnippet>
        </CodeSplit>

        If you take a closer look at the source code, you'll see what Cx is about. You can freely combine widgets with plain HTML
        and use special attributes to connect to the data. Whenever data changes, the page is automatically updated.
        
        Learn more:

        * [Data Binding](~/concepts/data-binding)
        * [JSX](~/intro/jsx)
        * [NPM Packages](~/intro/npm-packages)

        ## Widgets

        Cx offers an extensive library of widgets. You should get familiar commonly used widgets, such as:

        - [TextField](~/widgets/text-fields)
        - [NumberField](~/widgets/number-fields)
        - [DateField](~/widgets/date-fields)
        - [LookupField](~/widgets/lookup-fields)
        - [List](~/widgets/lists)
        - [Grid](~/widgets/grids)
        - [Menu](~/widgets/menus)
        - [Tabs](~/widgets/tabs)


        ## Advanced Concepts

        At this point you're probably wondering how all the pieces glue together. Well, you should read more about:

        - [Controllers](~/concepts/controllers)
        - [Data Views](~/concepts/data-views)
        - [Layouts](~/concepts/layout)
        - [Selection](~/concepts/selections)
        - [Formatting](~/concepts/formatting)
        - [Validation Groups](~/widgets/validation-groups)
        - [Router](~/concepts/router)
        - [Charts](~/concepts/charts)

        ## Cx Fiddle

        [Cx Fiddle](https://cxjs.io/fiddle) allows you to experiment with Cx directly in the browser, without setting up a new project.
        There are many examples to play with, and you can also create, save and share your own snippets.
        Here are a couple of links worth checking out:

        - [BMI Calculator](https://cxjs.io/fiddle/?f=luv00Rpw)
        - [Simple Grid](https://cxjs.io/fiddle/?f=XlL9AvMh)
        - [Grid Dashboard](https://cxjs.io/fiddle/?f=vwyHzOO1)
        - [Pong Game](https://cxjs.io/fiddle/?f=ndK9CuDC)
        - [Loan Calculator](https://cxjs.io/fiddle/?f=fYp9BujX)
        - [Bullet Chart](https://cxjs.io/fiddle/?f=XTLdQm8r)
        - [SVG Box Positioning](https://cxjs.io/fiddle/?f=W1FeJFcm)

        ## Demo Applications

        There are a few demo applications which will provide deeper insights into how Cx projects look from the inside:

        - [Cx Starter Kit](https://github.com/codaxy/cx-starter-kit) - dashboards, admin pages, routing, layout, etc.
        - [Employee Directory](https://github.com/codaxy/employee-directory-demo) + [blog post](https://blog.codaxy.com/cx-walkthrough-89dc37da9abc#.lt23d5ipc) - layout, REST API, etc.
        - [State of JS Explorer](https://github.com/codaxy/state-of-js-2016-explorer) - charts, styling
        - [tdo](https://github.com/mstijak/tdo) - appearance, keyboard navigation

        ## Starting a new Project

        You're now ready to start a new project with Cx.

        - [Command Line Interface](~/intro/command-line) - quickly scaffold new applications using Cx CLI
        - [Step by Step Tutorial](~/intro/step-by-step) - step-by-step tutorial on creating a new Cx application and configuring webpack and babel along the way

    </Md>
</cx>

