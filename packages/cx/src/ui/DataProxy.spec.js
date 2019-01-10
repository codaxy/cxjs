import {Cx} from './Cx';
import {Store} from '../data/Store';
import {VDOM} from "./VDOM";
import renderer from 'react-test-renderer';
import assert from 'assert';
import {Controller} from "./Controller";
import {DataProxy} from "./DataProxy";
import {computable} from "cx/ui";

describe('DataProxy', () => {

   it('can calculate values', () => {

      let widget = <cx>
         <DataProxy
            data={{
               $value: {bind: "value"}
            }}
         >
            <span text-bind="$value"/>
         </DataProxy>
      </cx>;

      let store = new Store({
         data: {
            value: "good"
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'span',
         props: {},
         children: ["good"]
      })
   });

   it('can write into values aliased with bind', () => {

      class TestController extends Controller {
         onInit() {
            this.store.set('$value', "excellent");
         }
      }

      let widget = <cx>
         <DataProxy
            data={{
               $value: {bind: "value"}
            }}
            controller={TestController}
         >
            <span text-bind="$value"/>
         </DataProxy>
      </cx>;

      let store = new Store({
         data: {
            value: "good"
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert(store.get('value'), 'excellent');

      assert.deepEqual(tree, {
         type: 'span',
         props: {},
         children: ["excellent"]
      })
   });

   it('can write into aliased values using provided setters', () => {

      class TestController extends Controller {
         onInit() {
            this.store.set('$value', "excellent");
         }
      }

      let widget = <cx>
         <DataProxy
            data={{
               $value: {
                  expr: computable('value', value => value),
                  set: (value, {store}) => {
                     store.set("value", value);
                  }
               }
            }}
            controller={TestController}
         >
            <span text-bind="$value"/>
         </DataProxy>
      </cx>;

      let store = new Store({
         data: {
            value: "good"
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert(store.get('value'), 'excellent');

      assert.deepEqual(tree, {
         type: 'span',
         props: {},
         children: ["excellent"]
      })
   });

   it('allows shorter syntax', () => {

      let widget = <cx>
         <DataProxy alias="$value" value-bind="value">
            <span text-bind="$value"/>
         </DataProxy>
      </cx>;

      let store = new Store({
         data: {
            value: "good"
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'span',
         props: {},
         children: ["good"]
      })
   });

   it('correctly updates aliased data after write', () => {

      class TestController extends Controller {
         onInit() {
            this.store.set('$value', "excellent");
            assert.equal(this.store.get("$value"), "excellent");
         }
      }

      let widget = <cx>
         <DataProxy
            data={{
               $value: {bind: "value"}
            }}
            controller={TestController}
         >
            <span text-bind="$value"/>
         </DataProxy>
      </cx>;

      let store = new Store({
         data: {
            value: "good"
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert(store.get('value'), 'excellent');

      assert.deepEqual(tree, {
         type: 'span',
         props: {},
         children: ["excellent"]
      })
   });

   it('properly binds structures', () => {

      class TestController extends Controller {
         onInit() {
            this.store.set('$person.firstName', "Jim");
         }
      }

      let widget = <cx>
         <DataProxy
            data={{
               $person: {bind: "person"}
            }}
            controller={TestController}
         >
            <span text-tpl="{$person.firstName} {$person.lastName}" />
         </DataProxy>
      </cx>;

      let store = new Store({
         data: {
            person: { firstName: "John", lastName: "Smith" }
         }
      });

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();

      assert(store.get('person.firstName'), 'Jim');

      assert.deepEqual(tree, {
         type: 'span',
         props: {},
         children: ["Jim Smith"]
      })
   });
});

