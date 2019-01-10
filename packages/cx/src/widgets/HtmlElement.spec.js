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

   it('allows spread bindings', () => {

      let store = new Store({
         data: {
            title: 'title'
         }
      });

      const component = renderer.create(
         <Cx store={store}>
            <a href="#" {...{title: {bind:"title"}}}>Link</a>
         </Cx>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'a',
         children: ['Link'],
         props: {
            href: '#',
            title: 'title'
         }
      })
   });
});

