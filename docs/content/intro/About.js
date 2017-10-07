import {HtmlElement} from 'cx/widgets';
import {Rescope, Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import Example from './AboutExample';

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

export const About = <cx>
    <Rescope bind="$page">
        <Md controller={PageController}>
            <CodeSplit>
                # About Cx

                Cx is a modern framework for building visually appealing, data-oriented, web applications.

                Cx features a large collection of composable and configurable widgets, JSX based syntax, declarative
                data-binding options and simplicity of use.

                The main goal of Cx is to streamline development of complex user interfaces which traditionally required
                components from many different vendors.
                Unlike many other frameworks which solve just one problem, Cx tries to solve UI problems
                holistically.
                Out of the box, Cx includes form elements, form validation, advanced grid control,
                navigational elements, tooltips, overlays, charts, routing, layout support, theming support, culture
                dependent formatting and more.

                Cx is based on modern technologies such as React, npm, babel, webpack and Sass.

                The product is made for individual developers and development teams who build business applications of
                any size.
                Cx provides a solid foundation and reduces the burden of dealing with UI complexities and browser
                quirks,
                making the development efforts more predictable.

                You might already be familiar with core Cx concepts, as it is inspired by the well known front-end
                products, such as React, Redux, Ext JS, Angular and D3.

                Please visit our [Getting Started](~/intro/getting-started)
                page to find out more.

                <div putInto="code" style="padding: 20px; background: #f6f6f6">
                    <Example/>
                </div>

                ## Browser Support

                The following browsers are supported:

                - Chrome
                - Firefox
                - Edge
                - IE11
                - Safari

                ## Licensing

                Cx framework is available under commercial license. The framework is free to use for non-commercial
                projects,
                e.g. personal/school/hobby projects.

            </CodeSplit>
        </Md>
    </Rescope>
</cx>
