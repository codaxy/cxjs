import {HtmlElement, FlexBox, TextField, Link} from 'cx/widgets';
import {Rescope, Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import Example from './WelcomeExample';

class PageController extends Controller {

    init() {
        this.generateBubbles();
    }

    generateBubbles() {
        let bubbles = Array.from({length: 100}).map(() => ({
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            r: Math.random() * 20
        }));
        this.store.set('bubbles', bubbles)
    }
}

export const Welcome = <cx>
    <Rescope bind="$page">
        <Md controller={PageController}>

            # Welcome to CxJS

            CxJS is a modern framework that helps you create web applications that are both data-oriented and
            visually appealing.

            CxJS makes application development easy by providing a complete set of widgets and charts combined with JSX
            syntax and declarative data-binding.

            CxJS solves problems with a unified approach, unlike other frameworks which solve one UI problem at a
            time.
            CxJS simplifies development of complex user interfaces which requires components from many different
            sources.
            CxJS package includes:
            <FlexBox>
                <Md>
                    * form components
                    * form validation
                    * grid (data-table) control
                    * charts
                    * navigational elements
                    * tooltips
                    * modal windows
                    * overlays
                </Md>
                <Md>
                    * powerful data-binding
                    * state management
                    * client-side routing
                    * complex layouts
                    * theming support
                    * culture dependent formatting
                    * and more
                </Md>
            </FlexBox>

            CxJS helps developers and their development teams create business applications of any size with ease by
            reducing the complications of UI and browser faults.

            <CodeSplit>

                Our start guide will show you the most important concepts and propel you on the right track to be
                an effective CxJS developer. Fill out your name below to get started with CxJS.

                <div class="widgets">
                    <div ws style="width: 300px">
                        <h2>Welcome!</h2>
                        <p>
                            What is your name? <TextField value-bind="$page.name"/>
                        </p>
                        <div visible-expr="!!{$page.name}">
                            <p>
                                Hello <strong text-tpl="{$page.name}"/>!
                            </p>
                            <p ws>
                                Please visit our
                                <Link href="~/intro/getting-started">Getting Started</Link>
                                page to learn more about CxJS.
                            </p>
                        </div>
                    </div>
                </div>

                <CodeSnippet putInto="code">{`
                    <h2>Welcome!</h2>
                    <p>
                        What is your name? <TextField value-bind="$page.name"/>
                    </p>
                    <div visible-expr="!!{$page.name}">
                        <p>
                            Hello <strong text-tpl="{$page.name}"/>!
                        </p>
                        <p ws>
                            Please visit our
                            <Link href="~/intro/getting-started">Getting Started</Link>
                            page to learn more about CxJS.
                        </p>
                    </div>
                `}</CodeSnippet>

                {/*<div putInto="code" style="padding: 20px; background: #f6f6f6">*/}
                {/*<Example/>*/}
                {/*</div>*/}

            </CodeSplit>
        </Md>
    </Rescope>
</cx>
