import { Cx } from '../ui/Cx';
import { VDOM } from '../ui/Widget';
import { HtmlElement } from './HtmlElement';
import { Store } from '../data/Store';

import renderer from 'react-test-renderer';
import assert from 'assert';

describe('HtmlElement', () => {

   it('renders textual content provided through the text property', () => {

      let widget = <cx>
         <div text:bind="text" />
      </cx>;

      let store = new Store({
         data: {
            text: 'Test'
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} />
      );

      let tree = component.toJSON();
      assert.equal(tree.type, 'div');
      assert.deepEqual(tree.children, ['Test']);
   });
});

