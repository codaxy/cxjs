import {Cx} from './Cx';
import {VDOM} from './Widget';
import {HtmlElement} from '../widgets/HtmlElement';
import {Store} from '../data/Store';
import {createFunctionalComponent} from './createFunctionalComponent';

import renderer from 'react-test-renderer';
import assert from 'assert';
import {Rescope} from "./Rescope";
import {LabelsLeftLayout} from "./layout/LabelsLeftLayout";
import {LabeledContainer} from "../widgets/form/LabeledContainer";
import {Repeater} from "./Repeater";
import {FirstVisibleChildLayout} from "./layout/FirstVisibleChildLayout";

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
         <Cx widget={widget} store={store} subscribe immediate/>
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

   it('visible and Rescope behave as expected', () => {
      const RootRescope = createFunctionalComponent(({}) => {
         return (
            <cx>
               <Rescope bind="x">
                  <div text-bind="y"/>
               </Rescope>
            </cx>
         );
      });

      const widget = (
         <cx>
            <RootRescope visible-expr="!!{x}"/>
         </cx>
      );

      let store = new Store({
         data: {
            x: {
               y: 'OK'
            }
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         children: ["OK"],
         props: {}
      })
   });

   it('visible and multiple items behave as expected', () => {
      const FComponent = createFunctionalComponent(({}) => {
         return (
            <cx>
               <div>1</div>
               <div visible={false}>2</div>
               <div>3</div>
            </cx>
         );
      });

      const widget = (
         <cx>
            <FComponent/>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, [{
         type: 'div',
         children: ["1"],
         props: {}
      }, {
         type: 'div',
         children: ["3"],
         props: {}
      }])
   });

   it('respects inner layouts', () => {
      const FComponent = createFunctionalComponent(({}) => {
         return (
            <cx>
               <LabeledContainer label="Test"/>
               <LabeledContainer label="Test"/>
            </cx>
         );
      });

      const widget = (
         <cx>
            <div layout={LabelsLeftLayout}>
               <FComponent/>
            </div>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [{
            type: 'table',
            props: {
               className: 'cxb-labelsleftlayout'
            },
            children: [{
               type: 'tbody',
               props: {},
               children: [{
                  type: 'tr',
                  props: {},
                  children: [{
                     type: 'td',
                     props: {
                        className: 'cxe-labelsleftlayout-label'
                     },
                     children: [{
                        type: 'label',
                        props: {
                           className: 'cxb-label'
                        },
                        children: ['Test']
                     }]
                  }, {
                     type: 'td',
                     props: {
                        className: "cxe-labelsleftlayout-field"
                     },
                     children: null
                  }]
               }, {
                  type: 'tr',
                  props: {},
                  children: [{
                     type: 'td',
                     props: {
                        className: 'cxe-labelsleftlayout-label'
                     },
                     children: [{
                        type: 'label',
                        props: {
                           className: 'cxb-label'
                        },
                        children: ['Test']
                     }]
                  }, {
                     type: 'td',
                     props: {
                        className: "cxe-labelsleftlayout-field"
                     },
                     children: null
                  }]
               }]
            }]
         }]
      })
   });


   it('can use refs for data bindings', () => {
      const X = createFunctionalComponent(({store}) => {
         let x = store.ref("x", "OK");
         return (
            <cx>
               <div text={x}/>
            </cx>
         );
      });

      const widget = (
         <cx>
            <X visible={true}/>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         children: ["OK"],
         props: {}
      })
   });

   it('adds children at the right place', () => {
      const X = ({children}) => <cx>
         <header/>
         <main>
            {children}
         </main>
         <footer/>
      </cx>;

      const widget = (
         <cx>
            <X>
               <div/>
            </X>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert.deepEqual(tree, [{
         type: 'header',
         children: null,
         props: {}
      }, {
         type: 'main',
         children: [{
            type: 'div',
            children: null,
            props: {}
         }],
         props: {}
      }, {
         type: 'footer',
         children: null,
         props: {}
      }])
   });

   it('works well with repeaters', () => {
      const X = createFunctionalComponent(({store}) => {
         let text = store.ref('$record.text');
         return <cx>
            <div text={text}/>
         </cx>;
      });

      const widget = (
         <cx>
            <Repeater records-bind="array">
               <X/>
            </Repeater>
         </cx>
      );

      let store = new Store({ data: { array: [{ text: '0' }, { text: '1' }, { text: '2' }]}});

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert.deepEqual(tree, [{
         type: 'div',
         children: ["0"],
         props: {}
      }, {
         type: 'div',
         children: ["1"],
         props: {}
      }, {
         type: 'div',
         children: ["2"],
         props: {}
      }]);

      store.update("array", array => [array[0], { text: "10"}, array[2]]);

      tree = component.toJSON();

      assert.deepEqual(tree, [{
         type: 'div',
         children: ["0"],
         props: {}
      }, {
         type: 'div',
         children: ["10"],
         props: {}
      }, {
         type: 'div',
         children: ["2"],
         props: {}
      }]);
   });

   it('can have its own layout', () => {
      const X = () => <cx>
         <div>1</div>
         <div>2</div>
         <div>3</div>
      </cx>

      const widget = (
         <cx>
            <X layout={FirstVisibleChildLayout}/>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert.deepEqual(tree, {
         type: 'div',
         children: ["1"],
         props: {}
      })
   });
});