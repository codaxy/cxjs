import { Content, HtmlElement, Checkbox, TextField, NumberField, Select, Option, Repeater, Text, Slider } from 'cx/widgets';
import { LabelsLeftLayout, Controller } from 'cx/ui';
import { computable } from 'cx/data';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ImportPath} from '../../components/ImportPath';

import {store} from '../../app/store';

store.set('intro.core.letterCount', '');

export const DataBinding = <cx>

    <Md>
        # Data Binding

        Data binding is a process of connecting the application state to the UI. If the connection is successful,
        data changes will be reflected in the UI and user actions will be properly translated into data changes.
        There are multiple ways of applying data to the widgets.

        ### Two-way Data Binding (`:bind`)

        Two-way data binding is commonly used in forms, as it supports both read and write operations.
        Let's use a checkbox for illustration.
        To display a checkbox, we need to know whether it's checked or not. That's the read operation.
        If the user clicks the checkbox, the corresponding value needs to be changed, and that's the write operation.

        <CodeSplit>

            <div class="widgets">
                <Checkbox value:bind='intro.core.checked'>Checkbox</Checkbox>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="csRQr9CA">{`
                <Checkbox value:bind='intro.core.checked'>Checkbox</Checkbox>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        > Suffix `:bind` is used on attributes to define a two-way binding.

        ### Data Expressions (`:expr`)

        Data expressions are string attributes that are compiled to JavaScript methods and used to calculate dynamic
        values at runtime.
        Let's add a new textfield control and use a data expression for its `enabled` property.

        <CodeSplit>

            <div class="widgets">
                <TextField value:bind='intro.core.text' enabled:expr='!{intro.core.checked}'/>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="csRQr9CA">{`
                    <TextField value:bind='intro.core.text'
                               enabled:expr='!{intro.core.checked}' />
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Note that now the text field and the checkbox from the previous section
        are both relying on the value of `intro.core.checked`. Try clicking the checkbox.

        > Suffix `:expr` is used on attributes to define a data expression.

        > Curly brackets denote data bindings.

        > Data bindings pointing to invalid locations will be reported as `undefined`.

        ### Templates (`:tpl`)

        Templates are data expressions which return strings. They are a convenient option to avoid using both types of
        quotes within data expressions.

        <CodeSplit>

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <TextField value:bind='intro.core.firstName' label="First Name"/>
                    <TextField value:bind='intro.core.lastName' label="Last Name"/>
                    <TextField value:tpl='Hello {intro.core.firstName} {intro.core.lastName}!' label="Template"
                               mode="view"/>
                    <TextField value:expr='"Hello "+{intro.core.firstName:s}+" "+{intro.core.lastName:s}+"!"'
                               label="Expression" mode="view"/>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="M60J0cyg">{`
                <div layout={LabelsLeftLayout}>
                  <TextField value:bind='intro.core.firstName' label="First Name" />
                  <TextField value:bind='intro.core.lastName' label="Last Name"/>
                  <TextField value:tpl='Hello {intro.core.firstName} {intro.core.lastName}!' label="Template" mode="view"/>
                  <TextField value:expr='"Hello "+{intro.core.firstName:s}+" "+{intro.core.lastName:s}+"!"' label="Expression" mode="view"/>
               </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Templates support [formatting](~/concepts/formatting).

        ### Function Bindings (Selectors)

        <CodeSplit>

            Sometimes a complicated calculation is required which is not suitable for a simple data or string expression.
            In that case, a function can be assigned to an attribute; however, this approach
            has some negative sides and should be taken with caution.

            <div class="widgets">
                <div>
                    <TextField value:bind='intro.core.letterCount' placeholder="Type here"/>
                    <p>
                        <Text
                            value={(storeData) => `You typed letter A ${((storeData.intro.core.letterCount || '').match(/A/g) || []).length} times.` }/>
                    </p>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="dfT9CWn4">{`
               store.set('intro.core.letterCount', '');
               ...
               <TextField value:bind='intro.core.letterCount' placeholder="Type here" />
               <p>
                  <Text value={(storeData) => \`You typed letter A
                  \${((storeData.intro.core.letterCount || '').match(/A/g) || []).length} times.\` } />
               </p>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        When using functions, remember that:

        - Selector functions take only one argument, which is the whole app state object.
        - Selector functions are invoked on each render pass.
        - Selector functions must be deterministic.
        - Unlike data expressions, selector functions are not memoized. It's up to developers to add memoization for
        expensive calls.
        - Deeply nested state is not guaranteed to be initialized (e.g. access to `intro.core.letterCount` may fail).

        Further reading:

        - https://github.com/reactjs/reselect

        <CodeSplit>

            ### Computables
        
            <ImportPath path="import { computable } from 'cx/data';" />

            Computables overcome shortcomings of function bindings by offering memoization and easier access to deep bindings.

            <div class="widgets">
                <div preserveWhitespace>
                    <NumberField value:bind='intro.core.a' placeholder="A" style="width:50px"/>
                    +
                    <NumberField value:bind='intro.core.b' placeholder="B" style="width:50px"/>
                    =
                    <Text
                        value={computable('intro.core.a', 'intro.core.b', (a, b) => a == null || b == null ? "ERR" : a + b)}/>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="9CxYWdfS">{`
            <div preserveWhitespace>
               <NumberField value:bind='intro.core.a' placeholder="A" />
               +
               <NumberField value:bind='intro.core.b' placeholder="B" />
               =
               <Text value={computable('intro.core.a', 'intro.core.b', (a, b) => a==null || b==null ? "ERR" : a + b )} />
            </div>
         `}</CodeSnippet>

        </CodeSplit>

        ### Setters

        <CodeSplit>

            Setters are used in combination with expressions and computables to provide write operations. A setter is a function
            used to process user input and write it to the store.

            <div class="widgets">
                <div preserveWhitespace>
                    A + 2 = <NumberField style="width:50px"
                                         value={{
                                            expr: '{intro.core.a}+2',
                                             set: (value, {store}) => { store.set('intro.core.a', value - 2) }
                                         }}/>
                    <br/>
                    A = <Text bind="intro.core.a" />
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="9CxYWdfS">{`
                <div preserveWhitespace>
                    A + 2 = <NumberField style="width:50px"
                                         value={{
                                            expr: '{intro.core.a}+2',
                                             set: (value, {store}) => { store.set('intro.core.a', value - 2) }
                                         }}/>
                    <br/>
                    A = <Text bind="intro.core.a" />
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        ### Throttle / Debounce

        Sometimes you want to limit the rate of propagating changes or to postpone
        the change until the user finishes interaction. In such scenarios `throttle`
        and `debounce` come in very handy.

        <CodeSplit>
            <div class="widgets">
                <div>
                    <div style="text-align:center">Direct</div>
                    <Slider value:bind='$page.slider.direct' />
                    <br/>
                    <Slider value:bind='$page.slider.direct' />
                </div>
                <div>
                    <div style="text-align:center">Throttle: 300ms</div>
                    <Slider value={{ bind: '$page.slider.throttled', throttle: 300 }} />
                    <br/>
                    <Slider value={{ bind: '$page.slider.throttled', throttle: 300}} />
                </div>
                <div>
                    <div style="text-align:center">Debounce: 300ms</div>
                    <Slider value={{ bind: '$page.slider.debounced', debounce: 300}} />
                    <br/>
                    <Slider value={{ bind: '$page.slider.debounced', debounce: 300}} />
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="RAVD9CLT">{`
                <div>
                    <div style="text-align:center">Direct</div>
                    <Slider value:bind='$page.slider.direct' />
                    <br/>
                    <Slider value:bind='$page.slider.direct' />
                </div>
                <div>
                    <div style="text-align:center">Throttle: 300ms</div>
                    <Slider value={{ bind: '$page.slider.throttled', throttle: 300 }} />
                    <br/>
                    <Slider value={{ bind: '$page.slider.throttled', throttle: 300}} />
                </div>
                <div>
                    <div style="text-align:center">Debounce: 300ms</div>
                    <Slider value={{ bind: '$page.slider.debounced', debounce: 300}} />
                    <br/>
                    <Slider value={{ bind: '$page.slider.debounced', debounce: 300}} />
                </div>
            `}</CodeSnippet>

        </CodeSplit>
    </Md>
</cx>;

