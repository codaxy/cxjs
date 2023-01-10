import { TextField } from "cx/widgets";
import { CodeSnippet } from "../../components/CodeSnippet";
import { CodeSplit } from '../../components/CodeSplit';
import { ImportPath } from "../../components/ImportPath";
import { Md } from '../../components/Md';



export const TypedModels = <cx>
   <Md>
        # Typed Models

        CxJS traditionally uses string based bindings, like in the example below:

        <CodeSplit>
            <CodeSnippet>{`
            <TextField value-bind="$page.input.value" disabled-bind="$page.input.disabled" />
            `}</CodeSnippet>
        </CodeSplit>

        This is very convenient for prototyping and simple pages, but this approach does not work so well for complex pages.
        As the underlying data model grows, it becomes very hard to keep track of things and it can be difficult to understand
         pages you haven't worked on before.

        TypeScript to the rescue! With combination of [mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
        and [JavaScript proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), it is possible
        to replace string based bindings with typed accessors. Please note that this doesn't work with Internet Explorer.

        Let's see how that works. First, we define a typed data model for our page:

        <CodeSplit>
            <CodeSnippet>{`
            interface PageModel {
                $page: {
                    input: {
                        value: string;
                        disabled: boolean;
                    }
                }
            }
            `}</CodeSnippet>
        </CodeSplit>

        ## `createAccessorModelProxy`

        <ImportPath path='import { createAccessorModelProxy } from "cx/data"' />

        The `createAccessorModelProxy` function is used to create a proxy for generating typed bindings instead of strings.
        It's rather simple how it works. The accessor chain is simply converted to a string path with `toString()`.

        <CodeSplit>
            <CodeSnippet>{`
            let { $page } = createAccessorModelProxy<PageModel>();

            console.log($page.toString()); // $page
            console.log($page.input.toString()); // $page.input
            console.log($page.input.value.toString()); // $page.input.value

            let { input } = $page;
            console.log(input.toString()); // $page.input
            console.log(input.value.toString()); // $page.input.value
            `}</CodeSnippet>
        </CodeSplit>

        Let's apply this to our example. CxJS can recognize accessor chains, so it's not required to use `-bind` suffixes or invoking `toString` manually.

        <CodeSplit>
            <CodeSnippet>{`
            <TextField value={$page.input.value} disabled={$page.input.disabled} />
            `}</CodeSnippet>
        </CodeSplit>



        There are no more magic strings! Typos are now errors, refactoring is easier, and new developers can easily understand the data model behind the page.

        There is more. Similar to bindings, you can now use typed expressions.

        <CodeSplit>
            <CodeSnippet>{`
            <div text={expr($page.input.value, value => value != null ? value.toUpperCase() : null)} />
            `}</CodeSnippet>
        </CodeSplit>

        > You'll note that `expr` and `computable` have the same syntax now. The only difference is that `computable` is adding memoization, so it should
        be used only when the expression is expensive to compute.

        You can also use typed selectors for the same effect, but in that case you must take care about possible `null` values.

        <CodeSplit>
            <CodeSnippet>{`
            <div text={({ $page }: PageModel) => $page?.input?.value?.toUpperCase()} />
            `}</CodeSnippet>
        </CodeSplit>

        ### Usage with Grid, List or Repeater

        When dealing with collections of data, it's often useful to create a typed accessor representing items in the collection.

        <CodeSplit>
            <CodeSnippet>{`
            interface Todo {
                id: string;
                text: string;
                completed: boolean;
            }

            interface PageModel {
                $page: {
                    todos: Todo[];
                },
                $todo: Todo;
            }

            let { $page, $todo } = createAccessorModelProxy<PageModel>();

            <Repeater records={$page.todos} recordAlias={$todo}>
                <Checkbox value={$todo.completed} text={$todo.text} />
            </Repeater>
            `}</CodeSnippet>
        </CodeSplit>

        ## Controllers

        Most of the benefits can be applied to controllers as well.

        Let's first create a typed controller:

        <CodeSplit>
            <CodeSnippet>{`
            // Controller.ts

            export default class extends Controller<PageModel> {
                onInit() {
                    this.store.init($page.todos, [
                        { id:uid(), text: 'Buy milk', completed: false },
                    ]);
                }

                onAddTodo(text: string) {
                    this.store.update(
                        $page.todos,
                        todos => [...todos, { id: uid(), text, completed: false }]
                    );
                }
            }
            `}</CodeSnippet>
        </CodeSplit>

        It's not really obvious from the code sample, but everything is now type checked.

        A bit cumbersome, but it's also possible to replace string based controller method invocations.

        <CodeSplit>
            <CodeSnippet>{`
            <Button
                onClick={(ev: MouseEvent, { store, controller }: Instance<PageModel, Controller>) => {
                    let text = store.get($page.input.value);
                    controller.onAddTodo(text);
                }}
            >
                Add Todo
            </Button>
            `}</CodeSnippet>
        </CodeSplit>

        With strong typing you also get great auto-complete support in modern editors such as VS Code.

        That's all. You should also check [Immer.js integration](~/concepts/immer-js-integration),
         which can help greatly with complex store operations.

   </Md>
</cx>

