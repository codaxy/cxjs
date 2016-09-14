import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';

export const Widgets = <cx>

    <Md>
        # Widgets

        Widgets are building blocks of your application. A large application may contain thousands of
        interactive and interconnected widgets.

        Widgets have two primary functions:

        1. Present information to the user.
        2. Gather inputs from the user and dispatch information required for updating the application state.

        ## Widget Trees

        <CodeSplit>

            Similar to HTML and DOM trees, in Cx framework, widgets are organized into widget trees, like the one shown
            in the next code snippet.

            <Content name="code">
                <CodeSnippet>{`
               export const Main = <cx>
                  <main outerLayout={Layout}>
                     <Content name="aside" items={Contents} />
                     <ContentRouter />
                  </main>
               </cx>
            `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        Users familiar with React.js will immediately recognize JSX syntax used to create widget trees.
        However, there are a few things different here:

        1. Cx widget trees are wrapped into the `&lt;cx&gt;` element.
        That is an instruction to Babel (JS transpiler) to convert this section into Cx widget configuration, instead of
        React
        function calls.

        2. HTML elements and widgets can be mixed. The rule is that widgets should start with an uppercase
        letter.

        3. Elements and widgets can contain additional instructions for layout, data binding, controllers etc.

        ## Store

        Widgets rely on central data repository called `store`.

        - Widgets use stored data to calculate data required for rendering (data binding process).
        - Widgets react on user inputs and update the store either directly (two-way bindings) or by dispatching
        actions which are translated into new application state (see Redux).
        - Store sends change notifications which produce a new rendering of the widget tree and DOM update.

        ## Application Loop

        <CodeSplit>
            <Content name="code">
                <CodeSnippet>{`
               let store = new Store();
               let appEl = document.getElementById('app');
               let stop = startAppLoop(appEl, store, Main);
            `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        Application loop consists of three steps:

        1. Change the application state;
        2. Render widgets and update DOM
        3. Capture user inputs or external events and convert them into state actions

        ## Widget Methods

        Cx widgets are very similar to React components. Each widget type has to define its `render` method,
        and optionally `explore`, `prepare` and `cleanup` methods in more advanced use-cases.

        <CodeSplit>

            ### `declareData`

            This method is used to define all bindable properties of the widget.

            ### `render`

            The `render` method should return virtual DOM representation of the widget. It's best to use standard JSX syntax
            to do that. Note that we don't use `&lt;cx&gt;` wrapper here so this translates into React calls.


            <Content name="code">

                <CodeSnippet>{`
               export class Rectangle extends BoundedObject {

                  declareData() {
                      return super.declareData({
                         anchors: undefined,
                         offset: undefined,
                         margin: undefined,
                         padding: undefined,
                         style: {structured: true},
                         class: {structured: true},
                         className: {structured: true}
                      }, ...arguments)
                   }

                  render(context, instance, key) {
                     var {data} = instance;
                     var {bounds} = data;
                     if (!bounds.valid())
                        return null;
                     return <g key={key}>
                        <rect x={bounds.l}
                              y={bounds.t}
                              width={bounds.width()}
                              height={bounds.height()}
                              style={data.style}
                              className={data.classNames}
                           />
                        {this.renderChildren(context, instance)}
                     </g>;
                  }

                  ...
               }
            `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        It's important to understand all parameters passed here:

        1. The `context` parameter is used to pass information from parents to children and vice-versa.
        For example, chart control is a complex widget made of sub-elements such as axes and series.
        When a chart is rendered, its axes are registered in the context, so when series are rendered they use
        axis information from the context.

        2. Same widget can be rendered multiple times at multiple locations. Imagine a table where each row
        has the same structure, but presents different data. The `instance` parameter contains `data`, `store` and
        other important properties related to the particular instance being rendered.
        Same `instance` parameter should be passed to all input handlers attached to elements being rendered.

        3. The `key` parameter hold an identifier specific to the given widget instance. Keys are used to match
        DOM elements between subsequent rendering cycles. Keys should be set on all top level
        elements returned by the render function. Widgets generally return a single top element, however
        some widgets (like form fields) return multiple top level elements (label, input).

        ### `explore`, `prepare` and `cleanup`

        The `explore` methods is invoked first to evaluate data-bound attributes (`instance.data`)
        and explore children (gather information from them). If the `visible` property evaluates to `false`,
        the widget will not be rendered and all processing stops.

        The `prepare` method is invoked afterwards to do additional preparation work
        before rendering. If `context` is used this is the opportunity to use get instance specific information.

        Similarly, the `cleanup` method is invoked after rendering is finished to do the cleanup, if necessary.
    </Md>
</cx>

