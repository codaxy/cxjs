import {Cx} from './Cx';
import {VDOM} from "./VDOM";
import {Container} from "./Container";
import {Store} from '../data/Store';
import renderer from 'react-test-renderer';
import assert from 'assert';
import {HtmlElement} from "../widgets/HtmlElement";

describe('Cx', () => {

   it('can render cx content', () => {
      let widget = <cx>
         <div>Test</div>
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: ["Test"]
      })
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
         <Cx widget={widget} store={store} subscribe immediate/>
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