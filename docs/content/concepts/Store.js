import { HtmlElement, Content, Checkbox, Repeater, FlexBox } from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';

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

