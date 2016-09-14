import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Tab} from 'cx/ui/nav/Tab';
import {ValidationGroup} from 'cx/ui/form/ValidationGroup';
import {TextField} from 'cx/ui/form/TextField';
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
        this.store.set('$page.bubbles', bubbles)
    }
}

export const About = <cx>
    <Md controller={PageController}>
        # About Cx

        Cx is a modern, multi-paradigm web framework inspired by React, Redux, Ext JS, Angular, D3 and other notable open-source libraries.
        Unlike most libraries which try to do just one thing and do it right, Cx tries to provide all necessary ingredients for building
        cool web applications. It is particularly convenient for building admin and dashboard applications as it includes
        a complete set of widgets with form elements, grids, navigation, charts, etc.
        There is support for inner (form) layouts and outer (app) layouts. The router is built-in, if you’re building
        a single page application. Cx offers very powerful data-binding mechanisms, culture dependent formatting,
        view controllers and much more. The most important thing is that developing new widgets or modding existing
        widgets is easy, so each application developed using Cx can have a unique look and feel.

        In combination with Babel and webpack, Cx offers great development experience.
        Thanks to its own babel plugin, views are written using a friendly HTML (React) like syntax.
        Thanks to webpack, changes are applied to the page without browser refreshes and page data is preserved.
        Again thanks to Babel, the source code is written using the latest version of JavaScript.

        The following browsers are supported:
        - Chrome
        - Firefox
        - Edge
        - IE11
        - Safari

        ## Code Samples

        ### Sample 1

        <CodeSplit>

            Login form with basic validation.

            <div class="widgets">
                <ValidationGroup valid:bind="$page.login.valid" layout={LabelsLeftLayout}>
                    <TextField label="Username" required={true} value:bind="$page.login.username"/>
                    <TextField label="Password" inputType='password' required={true} value:bind="$page.login.password"/>
                    <button type="button" disabled:expr="!{$page.login.valid}"
                            onClick={(e, {store}) => {
                                MsgBox.alert('Hello ' + store.get('$page.login.username') + '!')
                            }}>
                        Submit
                    </button>
                </ValidationGroup>
            </div>

            <CodeSnippet putInto="code">{`
               <ValidationGroup layout={LabelsLeftLayout} valid:bind="$page.login.valid">
                  <TextField label="Username" required={true} value:bind="$page.login.username" />
                  <TextField label="Password" inputType='password' required={true} value:bind="$page.login.password" />
                  <button type="button" disabled:expr="!{$page.login.valid}"
                          onClick={(e, {store}) => { MsgBox.alert('Hello ' + store.get('$page.login.username') + '!')}}>
                     Submit
                  </button>
               </ValidationGroup>
            `}</CodeSnippet>

        </CodeSplit>

        ### Sample 2

        <CodeSplit>

            A bubble chart.

            <div class="widgets">
                <Svg style={{width: '400px', height: '350px'}}>
                    <Chart offset='10 -15 -20 40' axes={{x: {type: 'numeric'}, y: {type: 'numeric', vertical: true}}}>
                        <Gridlines />
                        <BubbleGraph data:bind='$page.bubbles'/>
                    </Chart>
                </Svg>
                <button type="button" onClick={(e, {controller}) => {
                    controller.generateBubbles()
                }}>Generate
                </button>
            </div>


            <CodeSnippet putInto="code">{`
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
                     this.store.set('$page.bubbles', bubbles)
                  }
               }
               ...
               <Svg style={{ width: '400px', height: '350px'}}>
                  <Chart offset='10 -15 -20 40' axes={{x:{type:'numeric'}, y: {type:'numeric', vertical: true}}}>
                     <Gridlines />
                     <BubbleGraph data:bind='$page.bubbles' />
                  </Chart>
               </Svg>
               <button type="button" onClick={(e, {controller}) => { controller.generateBubbles() }}>Generate</button>
            `}</CodeSnippet>

        </CodeSplit>

        ## Licensing

        Cx framework is available under commercial license. The framework is free to use for school/hobby projects
        with non-commercial nature.

    </Md>
</cx>