import { Cx } from './Cx';
import { VDOM } from './Widget';
import { HtmlElement } from '../widgets/HtmlElement';
import { Store } from '../data/Store';
import { Controller } from './Controller';

import renderer from 'react-test-renderer';
import assert from 'assert';

describe('Controller', () => {

   it('invokes lifetime methods', () => {

      let init = 0,
         prepare = 0,
         explore = 0,
         cleanup = 0;

      class TestController extends Controller {
         onInit() {
            init++;
         }

         onExplore() {
            explore++;
         }

         onPrepare() {
            prepare++;
         }

         onCleanup() {
            cleanup++;
         }
      }

      let widget = <cx>
         <div controller={TestController} />
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.equal(init, 1);
      assert.equal(explore, 1);
      assert.equal(prepare, 1);
      assert.equal(cleanup, 1);
   });

   it('widgets invoke controller methods specified as strings', () => {

      let callback = 0;

      class TestController extends Controller {
         callback() {
            ++callback;
         }
      }

      class Cmp extends VDOM.Component {
         render() {
            return <div/>
         }

         componentDidMount() {
            this.props.instance.invoke("onTest");
         }
      }

      let store = new Store();

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <Cmp controller={TestController} onTest="callback" />
         </Cx>
      );

      let tree = component.toJSON();
      assert.equal(callback, 1);
   });

   it('widgets can access controller methods specified in ancestor controllers', () => {

      let callback1 = 0;
      let callback2 = 0;

      class TestController1 extends Controller {
         callback1() {
            ++callback1;
         }
      }

      class TestController2 extends Controller {
         callback2() {
            ++callback2;
         }
      }

      class Cmp extends VDOM.Component {
         render() {
            return <div/>
         }

         componentDidMount() {
            this.props.instance.invoke("onTest");
         }
      }

      let store = new Store();

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <div controller={TestController1}>
               <Cmp controller={TestController2} onTest="callback1" />
            </div>
         </Cx>
      );

      let tree = component.toJSON();
      assert.equal(callback1, 1);
      assert.equal(callback2, 0);
   });

   it('invokes triggers and computables in order of definition', () => {
      let log = [];
      class TestController extends Controller {
         onInit() {
            this.addTrigger('t1', [], () => {
               log.push('t1');
            }, true);

            this.addComputable('c1', [], () => {
               log.push('c1');
               return null;
            });

            this.addTrigger('t2', [], () => {
               log.push('t2');
            }, true)
         }
      }

      let widget = <cx>
         <div controller={TestController} />
      </cx>;

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.deepEqual(log, ["t1", "c1", "t2"]);
   });

   it('controllers are recreated if component is hidden and shown', () => {
      let initCount = 0;
      class TestController extends Controller {
         onInit() {
            initCount++;
         }
      }

      let store = new Store();
      store.set('visible', true);

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <div visible:bind="visible" controller={TestController} />
         </Cx>
      );

      let tree1 = component.toJSON();
      assert.equal(initCount, 1);

      store.set('visible', false);
      let tree2 = component.toJSON();
      assert.equal(tree2, null);

      store.set('visible', true);
      let tree3 = component.toJSON();
      assert.equal(initCount, 2);
   });
});

