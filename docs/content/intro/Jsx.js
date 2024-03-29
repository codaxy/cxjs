import { Content, Tab } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';

export const JsxPage = <cx>
    <Md>
        # JSX

        <CodeSplit>
            JSX is a syntax extension which enables HTML-like templates to be defined inside JavaScript code.
            JSX supports custom components and makes view templates stylish and effective.

            ## Babel

            [Babel](https://babeljs.io/) is a tool which compiles ECMAScript 6 and JSX into ECMAScript 5 (JavaScript).
            Babel has a plugin-based architecture which makes the transformation process very configurable.

            Babel compiles CxJS (JSX) into ECMAScript 5 using the `babel-plugin-transform-cx-jsx` plugin which is
            available for installation over [npm](https://www.npmjs.com/).

            If you take a look at the following example, you will see how JSX code is transformed into JS configuration
            objects.

            <Content name="code">
                <Tab value-bind="$page.code.tab" tab="code" mod="code" text="JSX" default />
                <CodeSnippet visible-expr="{$page.code.tab}=='code'">{`
                    <cx>
                        <div>
                            <TextField
                                value-bind="person.name"
                                required
                                label="Label"
                            />
                        </div>
                    </cx>

                    // The code below is equivalent to the code above

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
            </Content>
        </CodeSplit>

        ## CxJS Specific Features

        All JSX code blocks related to CxJS must be wrapped into the `cx` root element.
        If the code is not wrapped in the `cx` root element,
        it will be compiled using React's JSX compiler which will produce different results.

        ### Data-binding Attributes

        CxJS supports declarative data-binding using `-bind`, `-tpl` and `-expr` attribute suffixes.
        Bindings establish connections between widget properties and values in the [Store](~/concepts/store)
        pointed by the binding's path. Whenever data changes, widgets are automatically updated.
        Special binding syntax enables very readable and developer-friendly view code.

        ### Conditional Rendering

        <CodeSplit>
            CxJS exposes the `visible` property on all elements.
            This property controls whether an element should or should not be rendered.
            If `visible` is set or evaluated to `false`, the element and its children will not be rendered. The
            application will behave as if the element does not exists. Check out the following example.

            <Content name="code">
                <Tab value-bind="$page.code.tab" tab="code" mod="code" text="Conditional rendering" default />
                <CodeSnippet fiddle="pXZnFu2N" visible-expr="{$page.code.tab}=='code'">{`
                    <div visible-expr="!{form.valid}">
                        Please correct all errors in the form and try again.
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Whitespace Handling

        <CodeSplit>
            Whitespace is sometimes ignored which can cause frustration for the developer.
            CxJS offers the `ws` attribute which instructs CxJS to keep the whitespace to make it more
            convenient for the developer.

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="code" text="Whitespace Handling" default />
                <CodeSnippet fiddle="JYu5gf20" visible-expr="{$page.code.tab}=='code'">{`
                    <a href="#" class="btn" ws>
                        <i class="fa fa-icon" /> Link
                    </a>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### `style` and `class`

        <CodeSplit>
            In React, `style` needs to be an object and `className` is a replacement for the `class` attribute.
            CxJS does not have these restrictions, and you can freely use `style` strings, as well as `class` or
            `className` attributes.

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="code" text="Style" default />
                <CodeSnippet fiddle="enqL5Fok" visible-expr="{$page.code.tab}=='code'">{`
                    <div class="well" style="width:100px; height: 100px; background: red"></div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            If `class` is used as an object, all keys whose corresponding values
            are equal to `true` will be added to the class list.

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="code" text="Class" default />
                <CodeSnippet visible-expr="{$page.code.tab}=='code'">{`
                    <div class={{ panel: true, collapsed: { expr: '{panel.collapsed}' }}}>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Controller Callbacks

        <CodeSplit>
            In CxJS it will be common to see the attribute `onClick="save"`. This is a shorthand syntax which invokes
            the `save` method defined in the active controller.

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="code" text="Controller Callbacks" default />
                <CodeSnippet visible-expr="{$page.code.tab}=='code'">{`
                    <Button onClick="save">Save</Button>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Inner Text/HTML

        <CodeSplit>
            Another feature that makes CxJS stand out is the fact that in CxJS you can use `text` and `innerHtml`
            on all HTML container elements to set the inner content of the element.

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="code" text="Inner Text/HTML" default />
                <CodeSnippet value-bind="$page.code.tab">{`
                    <h2 text-bind="person.name" />
                    <div innerHtml-bind="html" />
                `}</CodeSnippet>
            </Content>

            The `innerHtml` property is very convenient for setting the inner content obtained through Markdown
            transformation or an AJAX call.
        </CodeSplit>
    </Md>
</cx>;
