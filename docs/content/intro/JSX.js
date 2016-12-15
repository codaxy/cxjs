import { HtmlElement, Checkbox, TextField, Text } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';



export const JsxPage = <cx>
    <Md>
        # JSX

        <CodeSplit>

            JSX is an extension of JavaScript syntax that allows XML/HTML-like structures inside JavaScript code. This is very convenient
            for expressing view templates which are traditionally based on HTML.
            JSX also supports custom components and makes views much more terse and elegant.

            ## Babel

            [Babel](https://babeljs.io/) is a tool which compiles ECMAScript 6 and JSX into ECMAScript 5 (JavaScript).
            Babel has a plugin-based architecture which makes the transformation process highly configurable.

            Babel compiles Cx (JSX) into ECMAScript 5, using the `babel-plugin-transform-cx-jsx` package which is available for installation over npm.

            The transformation step is very simple. JSX code is transformed into JS configuration objects,
            like in the following snippet (shown on the right on larger screens).

            <CodeSnippet putInto="code">{`
                <cx>
                    <div>
                        <TextField
                            value:bind="person.name"
                            required
                            label="Label" />
                    </div>
                </cx>

                //the code below is equivalent to the code above

                {
                    type: HtmlElement,
                    tag: 'div',
                    children: [{
                        type: TextField,
                        value: {
                            bind: 'person.name'
                        },
                        required: true,
                        label: 'Label'
                    }]
                 }
            `}</CodeSnippet>
        </CodeSplit>

        ## Cx Specific Features

        Cx uses JSX differently than React and it's important to understand the differences. All JSX code blocks related
        to Cx must be wrapped into the `cx` root element. The code, which is not wrapped, is compiled using React's
        JSX compiler which behaves differently.

        ### Data-binding Attributes

        Cx supports declarative data-binding using `:bind`, `:tpl` and `:expr` suffixes. Bindings establish connections
        between widget properties and values in the store pointed by the binding's path. Whenever data changes, widgets are
        automatically updated. Special binding syntax enables very terse views.

        ### Conditional Rendering

        <CodeSplit>

            Cx exposes the `visible` property on all elements which controls whether an element should be rendered or not.
            If `visible` is set or evaluated to `false`, the element and its children will not be rendered. The application
            will behave as if the element doesn't exists.

            <CodeSnippet putInto="code">{`
                <div visible:expr="!{form.valid}">
                    Please correct all errors in the form and try again.
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        ### Whitespace Handling

        <CodeSplit>

            Whitespaces are generally ignored, and that can be very annoying sometimes.
            Cx offers the `preserveWhitespace` attribute which instructs Cx to keep the whitespaces.

            <CodeSnippet putInto="code">{`
                <a href="#" class="btn" preserveWhitespace>
                    <i class="fa fa-icon" /> Link
                </a>
            `}</CodeSnippet>
        </CodeSplit>

        ### `style` and `class`

        <CodeSplit>

            In React, `style` needs to be an object and `className` is used instead of the `class` attribute, 
            because the DOM API exposes these properties in that way.
            Cx does not have these restrictions, and you can freely use `style` strings, as well as both `class` and `className` attributes.

            <CodeSnippet putInto="code">{`
                <div class="well" style="width:100px; height: 100px; background: red"></div>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>

            Furthermore, class can be an object. In this case, all keys whose corresponding values
            evaluate to `true` will be added to the class list.

            <CodeSnippet putInto="code">{`
                <div class={{
                    panel: true,
                    collapsed: { expr: '{panel.collapsed}' }
                }}>
            `}</CodeSnippet>
        </CodeSplit>

        ### Controller Callbacks

        <CodeSplit>

            In Cx it's common to see something like `onClick="save"`. This is a shorthand syntax which invokes
            the `save` method defined in the active controller.

            <CodeSnippet putInto="code">{`
                <Button onClick="save">Save</Button>
            `}</CodeSnippet>
        </CodeSplit>

        ### Inner Text/HTML

        <CodeSplit>

            Here’s another non-standard, but extremely convenient feature.
            In Cx, you may use text and innerHtml on all HTML container elements to set the inner content of the element.

            <CodeSnippet putInto="code">{`
                <h2 text:bind="person.name" />
                <div innerHtml:bind="html" />
            `}</CodeSnippet>

            The `innerHtml` property is very convenient for setting the inner content obtained through Markdown transformation
            or an AJAX call.
        </CodeSplit>
    </Md>
</cx>;

