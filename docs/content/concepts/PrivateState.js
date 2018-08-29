import {HtmlElement, Content, Checkbox, Repeater, Text, TextField, NumberField, Button, MsgBox} from '../../../packages/cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, LabelsTopLayout, LabelsLeftLayout} from '../../../packages/cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {computable, updateArray} from '../../../packages/cx/data';

class PageController extends Controller {
    onInit() {
        this.store.init('$page', {
            name: 'Jane',
            disabled: true,
            todoList: [
                {id: 1, text: 'Learn CxJS', done: true},
                {id: 2, text: "Feed the cat", done: false},
                {id: 3, text: "Take a break", done: false}
            ],
            count: 0
        });
    }

    greet() {
        let name = this.store.get('$page.name')
        MsgBox.alert(`Hello, ${name}!`);
    }
}

export const PrivateState = <cx>

    <Md>
        # PrivateState

        <CodeSplit>

            <ImportPath path="import { PrivateState } from 'cx/widgets';" />

            Repeater renders its content for each record of the assigned collection.
            Within the Repeater, use the `$record` alias to access the record data.
            Element index is available by using the `$index` alias.

            <div class="widgets">
                <div>
                    <Repeater records:bind="intro.core.items" >
                        <Checkbox value:bind="$record.checked" text:bind="$record.text"/>
                        <br/>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length'/> item(s).
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="F3RHqb0x">{`
                    store.set('intro.core.items', [
                        { text: 'A', checked: false },
                        { text: 'B', checked: false },
                        { text: 'C', checked: false }
                    ]);
                    ...
                    <Repeater records:bind="intro.core.items">
                        <Checkbox value:bind="$record.checked" text:bind="$record.text" />
                        <br/>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length' /> item(s).
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Examples

        In the examples below we will explore the most common ways to use the Store in CxJS:
        - inside Controllers (store is available via `this.store`)n
        - through two-way data binding ([explained here](~/concepts/data-binding))
        - inside event handlers

        <CodeSplit>

            ## `init`

            The `init` method is typically used inside the Controller's `onInit` method to initialize the data.
            It takes two arguments, `path` and `value`. The `path` is a string which is used as a key for storing the
            `value`. If the `path` is already taken, the method returns `false` without overwriting the existing value.
            Otherwise, it saves the `value` and returns `true`.

            <Content name="code">
                <CodeSnippet fiddle="fMy6p8FB">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init('$page', {
                                name: 'Jane',
                                disabled: true,
                                todoList: [
                                    { id: 1, text: 'Learn Cx', done: true }, 
                                    { id: 2, text: "Feed the cat", done: false },
                                    { id: 3, text: "Take a break", done: false }
                                ],
                                count: 0
                            });
                        }
                    
                        greet() {
                            let name = this.store.get('$page.name')
                            MsgBox.alert(\`Hello, \${name}!\`);
                        }
                    }
                    ...

                    <div layout={LabelsTopLayout} controller={PageController}>
                        <TextField label="Name" value:bind="$page.name" />
                        <Button onClick="greet">Greet</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>


        ## `get`

        The `get` method is used to read data from the Store. It takes any number of arguments or an array of strings
        representing paths and it returns the corresponding values.
        In the previous example, the `greet` method inside the controller is
        using the `Store.get` method to read the name from the Store.
        You will notice that we are able to directly access a nested property (`$page.name`) by using the `.` in our
        `path`
        string. Think of `path` as a property accessor.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsTopLayout} controller={PageController}>
                    <TextField label="Name" value:bind='$page.name'/>
                    <Button onClick="greet">Greet</Button>
                </div>
            </div>
        </CodeSplit>
    </Md>
</cx>

