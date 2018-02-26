import { Cx } from './Cx';
import { VDOM } from './Widget';
import { HtmlElement } from '../widgets/HtmlElement';
import { Store } from '../data/Store';
import { createFunctionalComponent } from './createFunctionalComponent';

import renderer from 'react-test-renderer';
import assert from 'assert';

describe('createFunctionalComponent', () => {

   it('allows spread', () => {
      const SuperDiv = createFunctionalComponent(({...props}) => {
         return (
            <cx>
               <div {...props} />
            </cx>
         );
      });
      
      let props = {
         text: "Spread",
         style: "background: red;"
      }
      
      const widget = (
         <cx>
            <SuperDiv 
               {...props}
               class="test"
            />
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         children: ["Spread"],
         props: {
            className: "test",
            style: {
               background: "red"
            }
         }
      })
   });
});