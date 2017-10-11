import { Cx } from './Cx';
import { VDOM } from './Widget';
import { HtmlElement } from '../widgets/HtmlElement';
import { Store } from '../data/Store';
import { Repeater } from './Repeater';

import renderer from 'react-test-renderer';
import assert from 'assert';

describe('Repeater', () => {

   it('allows sorting', () => {
      let data = [{
         value: 'C',
      }, {
         value: 'B'
      }, {
         value: 'A'
      }];

      let widget = <cx>
         <div>
            <Repeater records={data} sorters={[{ field: 'value', direction: 'ASC'}]} recordAlias="$item">
               <div text:bind="$item.value" />
            </Repeater>
         </div>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [
            {
               type: 'div',
               props: {},
               children: ["A"]
            },
            {
               type: 'div',
               props: {},
               children: ["B"]
            },
            {
               type: 'div',
               props: {},
               children: ["C"]
            }
         ]
      })
   });
});

