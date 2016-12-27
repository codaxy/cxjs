import { HtmlElement, Tab, ValidationGroup, TextField, Checkbox, Button, MsgBox } from 'cx/widgets';
import { Content, Rescope, LabelsLeftLayout, Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Chart, Gridlines, NumericAxis, BubbleGraph } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';

class PageController extends Controller {

    init() {
        this.generateBubbles();
    }

    generateBubbles() {
        var bubbles = Array.from({length: 100}).map(()=> ({
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            r: Math.random() * 20
        }));
        this.store.set('bubbles', bubbles)
    }
}

export const About = <cx>
    <Rescope bind="$page">
        <Md controller={PageController}>
            # About Cx

            Cx is a modern framework for building visually appealing, data-oriented, web applications.

            Cx features a large collection of composable and configurable widgets, JSX based syntax, declarative
            data-binding options and simplicity of use.

            <CodeSplit>
                <div class="widgets">
                    <div>
                        <Checkbox value:bind="enabled">Enable</Checkbox>
                        <br/>
                        <TextField value:bind="text" enabled:bind="enabled"/>
                    </div>
                </div>
                <CodeSnippet putInto="code">{`
                <Checkbox value:bind="enabled">Enable</Checkbox>
                <br/>
                <TextField enabled:bind="enabled" value:bind="name" />
            `}</CodeSnippet>
            </CodeSplit>


            The main goal of Cx is to streamline the development of complex user interfaces which traditionally required
            components from many different vendors.
            Unlike many other frameworks which solve just one problem, Cx tries to solve the UI problems holistically.
            Out of the box, Cx includes form elements, form validation, advanced grid control,
            navigational elements, tooltips, overlays, charts, routing, layout support, theming support, culture dependent formatting and more.

            <CodeSplit>
                <div class="widgets">
                    <ValidationGroup valid:bind="login.valid" layout={LabelsLeftLayout}>
                        <TextField label="Username" required value:bind="login.username"/>
                        <TextField label="Password" inputType='password' required value:bind="login.password"/>
                        <Button
                            disabled:expr="!{login.valid}"
                            onClick={(e, {store}) => {
                                MsgBox.alert('Hello ' + store.get('login.username') + '!')
                            }}
                        >
                            Submit
                        </Button>
                    </ValidationGroup>
                </div>

                <CodeSnippet putInto="code">{`
                <ValidationGroup layout={LabelsLeftLayout} valid:bind="login.valid">
                    <TextField label="Username" required value:bind="login.username" />
                    <TextField label="Password" inputType='password' required={true} value:bind="login.password" />
                    <Button
                        disabled:expr="!{login.valid}"
                        onClick={(e, {store}) => {
                            MsgBox.alert('Hello ' + store.get('login.username') + '!')
                        }}
                    >
                       Submit
                    </Button>
                </ValidationGroup>
            `}</CodeSnippet>

            </CodeSplit>

            Cx is based on modern technologies such as React, npm, babel, webpack and Sass.

            The product is made for individual developers and development teams who build business applications of any size.
            Cx provides a solid foundation and reduces the burden of dealing with UI complexities and browser quirks,
            making the development efforts more predictable.

            You might already be familiar with core Cx concepts, as it is inspired by the known front-end
            products, such as React, Redux, Ext JS, Angular and D3.

            Please visit our [Getting Started](~/intro/getting-started)
            page to find out more.

            ## Browser Support

            The following browsers are supported:

            - Chrome
            - Firefox
            - Edge
            - IE11
            - Safari

            ## Licensing

            Cx framework is available under commercial license. The framework is free to use for non-commercial projects,
            e.g. personal/school/hobby projects.

        </Md>
    </Rescope>
</cx>
