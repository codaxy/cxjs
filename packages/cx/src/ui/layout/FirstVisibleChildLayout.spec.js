import {Cx} from '../Cx';
import {VDOM} from '../Widget';
import {HtmlElement} from '../../widgets/HtmlElement';
import {Store} from '../../data/Store';

import renderer from 'react-test-renderer';
import assert from 'assert';
import {FirstVisibleChildLayout} from "./FirstVisibleChildLayout";
import {UseParentLayout} from "./UseParentLayout";
import {PureContainer} from "../PureContainer";

describe('FirstVisibleChildLayout', () => {

   it('renders only the first child', () => {

      let widget = <cx>
         <div layout={FirstVisibleChildLayout}>
            <header></header>
            <main></main>
            <footer></footer>
         </div>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
            type: 'div',
            props: {},
            children: [{type: 'header', props: {}, children: null}]
         }
      )
   });

   it('skips the first child if not visible', () => {

      let widget = <cx>
         <div layout={FirstVisibleChildLayout}>
            <header visible={false}></header>
            <main></main>
            <footer></footer>
         </div>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
            type: 'div',
            props: {},
            children: [{type: 'main', props: {}, children: null}]
         }
      )
   });

   it.skip('skips pure containers which use parent layouts', () => {

      let widget = <cx>
         <div layout={FirstVisibleChildLayout}>
            <PureContainer layout={UseParentLayout}>
               <header visible={false}></header>
            </PureContainer>
            <main></main>
            <footer></footer>
         </div>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
            type: 'div',
            props: {},
            children: [{type: 'main', props: {}, children: null}]
         }
      )
   });
});

