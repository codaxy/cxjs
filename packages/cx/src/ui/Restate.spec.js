import {Cx} from './Cx';
import {Restate} from './Restate';
import {Store} from '../data/Store';
import {VDOM} from "./VDOM";
import renderer from 'react-test-renderer';
import assert from 'assert';
import {Controller} from "./Controller";

describe('Restate', () => {

   it('provides a blank slate', () => {
      let widget = <cx>
         <div>
            <Restate data={{
               value: "good"
            }}>
               <span text-bind="value"/>
               <span text-bind="value2"/>
            </Restate>
         </div>
      </cx>;

      let store = new Store({
         data: {
            value: "bad",
            value2: "also bad"
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [
            {
               type: 'span',
               props: {},
               children: ["good"]
            },
            {
               type: 'span',
               props: {},
               children: null
            }
         ]
      })
   });

   it('wires declared data', () => {

      class TestController extends Controller {
         onInit() {
            this.store.init('name', "Sasa");
            this.store.init('nickname', "Sale");
         }
      }

      let widget = <cx>
         <div>
            <Restate data={{
               name: {bind: "person.name"}
            }}>
               <div controller={TestController}/>
            </Restate>
         </div>
      </cx>;

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert.equal(store.get('person.name'), "Sasa");
      assert(store.get('person.nickname') === undefined);
      assert(changed);
   });

   it('causes a global update if internal data changes', () => {

      let controller;

      class TestController extends Controller {
         onInit() {
            controller = this;
         }

         setNickname(nname) {
            this.store.set('nickname', nname)
         }
      }

      let widget = <cx>
         <div>
            <Restate
               data={{
                  name: {bind: "person.name"}
               }}
            >
               <div controller={TestController} text-bind="nickname"/>
            </Restate>
         </div>
      </cx>;

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [
            {
               type: 'div',
               props: {},
               children: null
            }
         ]
      });

      controller.setNickname('Sale');

      let tree2 = component.toJSON();
      assert.deepEqual(tree2, {
         type: 'div',
         props: {},
         children: [
            {
               type: 'div',
               props: {},
               children: ["Sale"]
            }
         ]
      })
   });

   it("doesn't notify parent if not necessary in detached mode", () => {

      class TestController extends Controller {
         onInit() {
            this.store.init('nickname', "Sale");
         }
      }

      let widget = <cx>
         <div>
            <Restate detached data={{
               name: {bind: "person.name"}
            }}>
               <div controller={TestController}/>
            </Restate>
         </div>
      </cx>;

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert(!changed);
   });
});

