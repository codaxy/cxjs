import {HtmlElement, Checkbox, TextField, Text} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';


export const GettingStarted = <cx>
    <Md>
        # Getting Started

        ## Basic Concepts

        Understanding how data-binding works and concepts such as [Store](~/concepts/store) and [JSX
        syntax](~/intro/jsx) will make it easier to understand
        CxJS. Start by thinking of spreadsheets.

        While holding the application state, the [Store](~/concepts/store) offers different methods of accessing and
        modifying the data. The
        [Store](~/concepts/store) is at your disposal for all widgets where the user can access data directly using
        bindings, and/or the
        user can calculate required values using different expressions (formulas).

        CxJS uses [JSX syntax](~/intro/jsx), [introduced by
        React](https://facebook.github.io/react/docs/introducing-jsx.html), which enables structures similar to HTML/XML
        inside JavaScript. CxJS has custom [data binding instructions](~/concepts/data-binding) that specify how widgets
        connect to the underlying
        data store. You can access data from the [Store](~/concepts/store) using references (bindings) like you would on
        a spreadsheet.
        Spreadsheet cell references have a predefined format such as A1 or B2, but with CxJS you choose the names that
        custom fit you. Nested data can be accessed using the `.` operator, for example `person.name`. Widget
        properties can be connected (bound) to values from the [Store](~/concepts/store) and are automatically updated
        whenever the referenced data changes.

        Check out the following example:

        <CodeSplit>
            <div class="widgets">
                <div>
                    <Checkbox value:bind="enabled">Enable</Checkbox>
                    <br/>
                    <TextField value:bind="text" disabled:expr="!{enabled}"/>
                </div>
            </div>
            <CodeSnippet putInto="code" fiddle="HkcFZwXT">{`
                <div>
                    <Checkbox value:bind="enabled">Enable</Checkbox>
                    <br/>
                    <TextField value:bind="text" disabled:expr="!{enabled}"/>
                </div>
            `}</CodeSnippet>
        </CodeSplit>


        Looking at the source code on the right of your screen, you will see an example of how CxJS works. The user will
        be able to freely combine widgets with plain HTML and use special attributes to connect the data. Data changes
        are applied automatically, so it saves you the hassle of writing code required for updating the page.

        Click the links below to learn more:

        * [Store](~/concepts/store)
        * [JSX](~/intro/jsx)
        * [Data Binding](~/concepts/data-binding)
        * [NPM Packages](~/intro/npm-packages)

        ## Widgets

        CxJS offers an extensive library of widgets. Get familiar with the widgets most commonly used:

        - [TextField](~/widgets/text-fields)
        - [NumberField](~/widgets/number-fields)
        - [DateField](~/widgets/date-fields)
        - [LookupField](~/widgets/lookup-fields)
        - [List](~/widgets/lists)
        - [Grid](~/widgets/grids)
        - [Menu](~/widgets/menus)
        - [Tabs](~/widgets/tabs)


        ## Advanced Concepts

        In order to put all the pieces together, get familiar with the concepts listed below:

        - [Controllers](~/concepts/controllers)
        - [Data Views](~/concepts/data-views)
        - [Layouts](~/concepts/layout)
        - [Selection](~/concepts/selections)
        - [Formatting](~/concepts/formatting)
        - [Validation Groups](~/widgets/validation-groups)
        - [Router](~/concepts/router)
        - [Charts](~/concepts/charts)

        ## CxJS Fiddle

        [CxJS Fiddle](https://cxjs.io/fiddle) allows you to experiment with CxJS directly in the browser, without setting up
        a new project. Below are some examples to test out. You can also create, save, and share your own snippets.
        Check out the links below:

        - [BMI Calculator](https://cxjs.io/fiddle/?f=luv00Rpw)
        - [Simple Grid](https://cxjs.io/fiddle/?f=XlL9AvMh)
        - [Dashboard Grid](https://cxjs.io/fiddle/?f=vwyHzOO1)
        - [Pong Game](https://cxjs.io/fiddle/?f=ndK9CuDC)
        - [Loan Calculator](https://cxjs.io/fiddle/?f=fYp9BujX)
        - [Bullet Chart](https://cxjs.io/fiddle/?f=XTLdQm8r)
        - [SVG Box Positioning](https://cxjs.io/fiddle/?f=W1FeJFcm)

        ## Demo Applications

        Below are demo applications which will provide a deeper insight into how CxJS projects function:

        - [CxJS Starter Kit](https://github.com/codaxy/cx-starter-kit) - dashboards, admin pages, routing, layouts
        - [Worldoscope](https://github.com/codaxy/worldoscope) - charts, data tables, Material theme.
        - [CxJS Hacker News](https://github.com/codaxy/cxjs-hackernews) - startup performance, layout, infinite scrolling
        - [Employee Directory](https://github.com/codaxy/employee-directory-demo) + [blog
        post](https://blog.codaxy.com/cx-walkthrough-89dc37da9abc#.lt23d5ipc) - layout, REST API
        - [State of JS Explorer](https://github.com/codaxy/state-of-js-2016-explorer) - charts, styling
        - [tdo](https://github.com/mstijak/tdo) - dark appearance, keyboard navigation

        ## Starting a new Project

        You are now ready to start a new project with CxJS.

        - [Command Line Interface](~/intro/command-line) - quickly generate new applications using Cx CLI
        - [Step by Step Tutorial](~/intro/step-by-step) - step-by-step tutorial on creating new CxJS application. You will also
        configure both [webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/) along the way
    </Md>
</cx>

