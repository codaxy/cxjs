import { Cx } from './Cx';
import { VDOM } from "./VDOM";
import { Container } from "./Container";
import { Store } from '../data/Store';
import renderer from 'react-test-renderer';
import assert from 'assert';
import { HtmlElement } from "../widgets/HtmlElement";

describe('Cx', () => {

   it('can render cx content', () => {
      let widget = <cx>
         <div>Test</div>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: ["Test"]
      })
   });

   it('store changes preserve the instance', () => {

      let instanceLog = [];
      let storeLog = [];

      let widget = <cx>
         <div text-bind="text" onExplore={(context, instance) => {
            instanceLog.push(instance);
            storeLog.push(instance.store);
         }} />
      </cx>;

      let store1 = new Store({ data: { text: 'Test1' } });
      let store2 = new Store({ data: { text: 'Test2' } });

      const component = renderer.create(
         <Cx widget={widget} store={store1} subscribe immediate />
      );

      let tree1 = component.toJSON();
      assert.deepEqual(tree1, {
         type: 'div',
         props: {},
         children: ["Test1"]
      });

      component.update(<Cx widget={widget} store={store2} subscribe immediate />);

      let tree2 = component.toJSON();
      assert.deepEqual(tree2, {
         type: 'div',
         props: {},
         children: ["Test2"]
      });

      assert.equal(instanceLog.length, 2);
      assert.equal(instanceLog[0], instanceLog[1]); //store changes should preserve the instance
      assert(storeLog[0] === store1);
      assert(storeLog[1] === store2);
   });

   it('invokes lifetime methods in the right order', () => {

      let events = [];

      class TestWidget extends Container {
         explore(context, instance) {
            super.explore(context, instance);
            events.push(["explore", this.id]);
         }

         exploreCleanup(context, instance) {
            //super.exploreCleanup(context, instance);
            events.push(["exploreCleanup", this.id]);
         }

         prepare(context, instance) {
            //super.prepare(context, instance);
            events.push(["prepare", this.id]);
         }

         prepareCleanup(context, instance) {
            //super.prepareCleanup(context, instance);
            events.push(["prepareCleanup", this.id]);
         }

         render(context, instance, key) {
            events.push(["render", this.id]);
            return <div key={key}>
               {this.renderChildren(context, instance)}
            </div>
         }
      }

      let widget = <cx>
         <TestWidget id="0">
            <TestWidget id="0.0" />
            <TestWidget id="0.1">
               <TestWidget id="0.1.0" />
               <TestWidget id="0.1.1" />
            </TestWidget>
            <TestWidget id="0.2">
               <TestWidget id="0.2.0" />
            </TestWidget>
         </TestWidget>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [{
            type: 'div',
            props: {},
            children: null
         }, {
            type: 'div',
            props: {},
            children: [{
               type: 'div',
               props: {},
               children: null
            }, {
               type: 'div',
               props: {},
               children: null
            }]
         }, {
            type: 'div',
            props: {},
            children: [{
               type: 'div',
               props: {},
               children: null
            }]
         }]
      });

      //console.log(events);

      assert.deepEqual(events, [
         ["explore", "0"],
         ["explore", "0.0"],
         ["exploreCleanup", "0.0"],
         ["explore", "0.1"],
         ["explore", "0.1.0"],
         ["exploreCleanup", "0.1.0"],
         ["explore", "0.1.1"],
         ["exploreCleanup", "0.1.1"],
         ["exploreCleanup", "0.1"],
         ["explore", "0.2"],
         ["explore", "0.2.0"],
         ["exploreCleanup", "0.2.0"],
         ["exploreCleanup", "0.2"],
         ["exploreCleanup", "0"],
         ["prepare", "0"],
         ["prepare", "0.0"],
         ["prepareCleanup", "0.0"],
         ["prepare", "0.1"],
         ["prepare", "0.1.0"],
         ["prepareCleanup", "0.1.0"],
         ["prepare", "0.1.1"],
         ["prepareCleanup", "0.1.1"],
         ["prepareCleanup", "0.1"],
         ["prepare", "0.2"],
         ["prepare", "0.2.0"],
         ["prepareCleanup", "0.2.0"],
         ["prepareCleanup", "0.2"],
         ["prepareCleanup", "0"],
         ["render", "0.2.0"],
         ["render", "0.2"],
         ["render", "0.1.1"],
         ["render", "0.1.0"],
         ["render", "0.1"],
         ["render", "0.0"],
         ["render", "0"],
      ])
   });
});