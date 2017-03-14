import { HtmlElement, Content, Checkbox, Repeater, FlexBox } from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';

import {store} from '../../app/store';

store.set('store.itemsA', [
   { text: 'A', checked: false },
   { text: 'B', checked: false },
   { text: 'C', checked: false },
   { text: 'D', checked: false },
   { text: 'E', checked: false },
   { text: 'F', checked: false }
]);

store.copy('store.itemsA', 'store.itemsB');

store.move('store.itemsA', 'store.itemsC');

class StController extends Controller {
    init() {
        super.init();
    }
}

export const Store = <cx>

    <Md>
        # Store

        <ImportPath path="import { Store } from 'cx/data';" />

        Widgets rely on central data repository called `store`.

        - Widgets use stored data to calculate data required for rendering (data binding process).
        - Widgets react on user inputs and update the store either directly (two-way bindings) or by dispatching
        actions which are translated into new application state (see Redux).
        - Store sends change notifications which produce a new rendering of the widget tree and DOM update.

        ### Principles

        - The state of the whole application is stored in an object tree within a single store.
        - The state is read-only. The only way to change the state is through store methods or with the use of
        two-way data binding.
        - The state is immutable. On every change, a new copy of the state is created containing the updated values.

        ### Store methods

        <MethodTable methods={[{
            signature: 'Store.init(path, value)',
            description: <cx><Md>
               If the `path` key is not already defined inside the store, it sets its value to `value` and 
               returns `true`. Otherwise it returns `false`, without making any changes. `path` is a string.
            </Md></cx>
         }, {
            signature: 'Store.set(path, value)',
            description: <cx><Md>
               Sets the base path of the application by examining DOM `script` elements.
               If the `src` property matches the given path, the base is used as the application path base.
            </Md></cx>
         }, {
            signature: 'Store.get(path)',
            description: <cx><Md>
               Takes a single string or an array of strings and returns the corresponding values.
            </Md></cx>
         }, {
            signature: 'Store.delete(path)',
            description: <cx><Md>
               Takes given relative and absolute path and returns tilde based path.
            </Md></cx>
         }, {
            signature: 'Store.update(path, updateFn, ...args)',
            description: <cx><Md>
               Checks if the given path is local.
            </Md></cx>
         }, {
            signature: 'Store.toggle(path)',
            description: <cx><Md>
               Checks if the given path is local.
            </Md></cx>
         }]}/> 

        <CodeSplit>

            

            <div class="widgets">
                <div controller={StController}>
                    <Repeater records:bind="store.items">
                        <Checkbox value:bind="$record.checked" text:bind="$record.text" />
                        <br/>
                    </Repeater>
                </div>
            </div>

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
    </Md>
</cx>

