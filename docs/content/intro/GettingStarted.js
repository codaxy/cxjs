import { HtmlElement, Checkbox, TextField, Text } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';



export const GettingStarted = <cx>
    <Md>
        # Getting Started

        ## Basic Concepts

        The most important steps of getting familiar with Cx is to understand its syntax and data-binding process.

        Cx uses JSX syntax, [introduced by React](https://facebook.github.io/react/docs/introducing-jsx.html),
        which enables HTML/XML-like structures inside JavaScript.
        On top of JSX syntax, Cx uses custom data binding instructions which connect the widgets with the
        underlying data store.

        <CodeSplit>

            Check out the following example:

            <TextField value:bind="name" placeholder="What's your name?" />

            <p visible:expr="{name}!=null" preserveWhitespace>
                Hi <strong text:bind="name" />!
                Did you know that your name contains exactly <Text expr="{name}.length" /> letters?
            </p>

            <CodeSnippet putInto="code">{`

            <TextField value:bind="name" placeholder="What's your name?" />

            <p visible:expr="{name}!=null" preserveWhitespace>
                Hi <strong text:bind="name" />!
                Did you know that your name contains exactly <Text expr="{name}.length" /> letters?
            </p>

            `}</CodeSnippet>
        </CodeSplit>

        If you take a closer look at the source code, you'll see what Cx is about. You can freely combine widgets with plain HTML
        and use special attributes to connect to the data. Whenever data changes, the page is automatically updated.

        > The code containing JSX syntax must be processed through a preprocessor tool before it's served to the browser.
        The most popular preprocessor tool is [Babel](https://babeljs.io/), which besides JSX processing also
        transpiles the latest JavaScript features into ES5.

        Learn more:

        * [Data Binding](~/concepts/data-binding)
        * [JSX](~/intro/jsx)

        ## Widgets

        Now that you're familiar with the basic concepts, you should take a look at some of the widgets from the library
        that Cx offers:

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

        [Cx Fiddle](https://cx.codaxy.com/fiddle) allows you to experiment with Cx directly in the browser, without setting up a new project.
        There are many examples to play with, and you can also create, save and share your own snippets.
        Here are a couple of links worth checking out:

        - [BMI Calculator](http://cx.codaxy.com/fiddle/?f=luv00Rpw)
        - [Simple Grid](http://cx.codaxy.com/fiddle/?f=XlL9AvMh)
        - [Grid Dashboard](http://cx.codaxy.com/fiddle/?f=vwyHzOO1)
        - [Pong Game](http://cx.codaxy.com/fiddle/?f=ndK9CuDC)
        - [Loan Calculator](http://cx.codaxy.com/fiddle/?f=fYp9BujX)
        - [Bullet Chart](http://cx.codaxy.com/fiddle/?f=XTLdQm8r)
        - [SVG Box Positioning](http://cx.codaxy.com/fiddle/?f=W1FeJFcm)

        ## Demo Applications

        There are a few demo applications which will provide deeper insights into how Cx projects look from the inside:

        - [Cx Starter Kit](https://github.com/codaxy/cx-starter-kit) - dashboards, admin pages, routing, layout, etc.
        - [Employee Directory](https://github.com/codaxy/employee-directory-demo) + [blog post](https://blog.codaxy.com/cx-walkthrough-89dc37da9abc#.lt23d5ipc) - layout, REST API, etc.
        - [State of JS Explorer](https://github.com/codaxy/state-of-js-2016-explorer) - charts, styling
        - [tdo](https://github.com/mstijak/tdo) - appearance, keyboard navigation

        ## Starting a new Project

        You should now be ready to start a new project with Cx. Before doing that you should check out:

        - [Command Line Interface](~/intro/command-line) - quickly scaffold new applications using Cx CLI
        - [Step by Step Tutorial](~/intro/step-by-step) - step-by-step tutorial on creating a new Cx application and configuring webpack and babel along the way

    </Md>
</cx>

