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
            <FComponent visible={true}/>
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

   it('respects inner layout', () => {
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
               <FComponent visible={true}/>
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
});