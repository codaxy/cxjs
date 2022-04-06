import { TextField } from "cx/widgets";
import { CodeSnippet } from "../../components/CodeSnippet";
import { CodeSplit } from '../../components/CodeSplit';
import { ImportPath } from "../../components/ImportPath";
import { Md } from '../../components/Md';



export const ImmerJsIntegration = <cx>
   <Md>
        # Immer.js Integration

        CxJS requires all data to be immutable. Each change (`update`) operation is required to return a new object.
        This can be very challenging with complex and deeply nested data models, especially for developers who
        are not used to that.

        [Immer.js](https://immerjs.github.io/immer/) can help greatly with that, especially in combination with [typed data models](~/concepts/typed-models).

        In order to use Immer.js, you need to install `immer` and `cx-immer` npm packages.

        ```
        npm install immer cx-immer
        ```

        Once installed you should enable Immer in CxJS stores. This should be done on application startup.

        <CodeSplit>
            <CodeSnippet>{`
                import { enableImmerMutate } from "cx-immer";

                enableImmerMutate();
            `}</CodeSnippet>
        </CodeSplit>

        Once this is implemented you can use the `mutate` method for updating data in the store.

        <CodeSplit>
            <CodeSnippet>{`
            // Controller.ts

            export default class extends Controller<PageModel> {
                // after
                onAddTodo(text: string) {
                    this.store.mutate(
                        $page.todos,
                        todos => {
                            // it's ok to mutate data inside the mutate method
                            todos.push({ id: uid(), text, completed: false });
                            //it's not required to return anything
                        }
                    );
                }

                // before (immutable operation)
                onAddTodo(text: string) {
                    this.store.update(
                        $page.todos,
                        todos => [...todos, { id: uid(), text, completed: false }]
                    );
                }

                // after
                onMarkComplete(id: string) {
                    this.store.mutate(
                        $page.todos,
                        todos => {
                            let todo = todos.find(t => t.id === id);
                            todo.completed = true;
                        }
                    );
                }

                // before
                onMarkComplete(id: string) {
                    this.store.update(
                        $page.todos,
                        updateArray,
                        todo => ({ ...todo, completed: true }),
                        todo => todo.id == id
                    );
                }
            }
            `}</CodeSnippet>
        </CodeSplit>
   </Md>
</cx>

