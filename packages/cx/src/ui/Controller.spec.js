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
});

