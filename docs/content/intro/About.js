import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Tab} from 'cx/ui/nav/Tab';
import {ValidationGroup} from 'cx/ui/form/ValidationGroup';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Button} from 'cx/ui/Button';
import {Rescope} from 'cx/ui/Rescope';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {CodeSnippet} from '../../components/CodeSnippet';
import {Svg} from 'cx/ui/svg/Svg';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {BubbleGraph} from 'cx/ui/svg/charts/BubbleGraph';
import {Controller} from 'cx/ui/Controller';
import {MsgBox} from 'cx/ui/overlay/MsgBox';

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
            using components from many different vendors.
            Unlike many other frameworks which solve just one problem, Cx tries to provide all necessary components in
            one consistent package.
            That means that, out of the box, Cx includes form elements, form validation, advanced grid control,
            navigational
            elements, charts, routing, layout support, theming support, culture dependent formatting and more.

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

            Cx is made for individual developers and development teams who build business applications of any size.
            Cx provides a solid foundation and reduces the burden of dealing with UI complexities and browser quirks,
            making the project more predictable.

            You may already be familiar with Cx as it is inspired by the best concepts from well known front-end
            products,
            such as React, Redux, Ext JS, Angular and D3.

            ## Browser Support

            The following browsers are supported:

            - Chrome
            - Firefox
            - Edge
            - IE11
            - Safari

            ## Licensing

            Cx framework is available under commercial license. The framework is free to use for school/hobby projects
            with non-commercial nature.

        </Md>
    </Rescope>
</cx>