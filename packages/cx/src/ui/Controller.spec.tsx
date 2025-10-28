import { Store } from "../data/Store";
import { Controller, ControllerConfig } from "./Controller";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { VDOM, Widget, WidgetConfig } from "./Widget";
import { Instance } from "./Instance";
import { bind } from "./bind";
import assert from "assert";
import { RenderingContext } from "./RenderingContext";

describe("Controller", () => {
   it("invokes lifetime methods", () => {
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

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <div controller={TestController} />
         </cx>,
      );

      let tree = component.toJSON();
      assert.equal(init, 1);
      assert.equal(explore, 1);
      assert.equal(prepare, 1);
      assert.equal(cleanup, 1);
   });

   it("widgets invoke controller methods specified as strings", () => {
      let callback = 0;

      class TestController extends Controller {
         callback() {
            ++callback;
         }
      }

      interface Config extends WidgetConfig {
         onTest: string;
      }

      class Cmp extends Widget<Config> {
         render(context: RenderingContext, instance: Instance, key: string) {
            return null;
         }

         onInit(context: RenderingContext, instance: Instance) {
            instance.invoke("onTest");
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <Cmp controller={TestController} onTest="callback" />
         </cx>,
      );

      let tree = component.toJSON();
      assert.equal(callback, 1);
   });

   it("widgets can access controller methods specified in ancestor controllers", () => {
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

      interface Config extends WidgetConfig {
         onTest: string;
      }

      class Cmp extends Widget<Config> {
         render(context: RenderingContext, instance: Instance, key: string) {
            return null;
         }

         onInit(context: RenderingContext, instance: Instance) {
            instance.invoke("onTest");
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <div controller={TestController1}>
               <Cmp controller={TestController2} onTest="callback1" />
            </div>
         </cx>,
      );

      let tree = component.toJSON();
      assert.equal(callback1, 1);
      assert.equal(callback2, 0);
   });

   it("ancestor controllers are initialized first", () => {
      let order: string[] = [];

      class TestController1 extends Controller {
         onInit() {
            order.push("1");
         }
      }

      class TestController2 extends Controller {
         onInit() {
            order.push("2");
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <div controller={TestController1}>
               <div controller={TestController2} />
            </div>
         </cx>,
      );

      let tree = component.toJSON();
      assert.deepEqual(order, ["1", "2"]);
   });

   it("controllers on invisible elements are not initialized", () => {
      let order: string[] = [];

      class TestController1 extends Controller {
         onInit() {
            order.push("1");
         }
      }

      class TestController2 extends Controller {
         onInit() {
            order.push("2");
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <div controller={TestController1}>
               <div visible={false} controller={TestController2} />
            </div>
         </cx>,
      );

      let tree = component.toJSON();
      assert.deepEqual(order, ["1"]);
   });

   it("invokes triggers and computables in order of definition", () => {
      let log: string[] = [];

      class TestController extends Controller {
         onInit() {
            this.addTrigger(
               "t1",
               [],
               () => {
                  log.push("t1");
               },
               true,
            );

            this.addComputable("c1", [], () => {
               log.push("c1");
               return null;
            });

            this.addTrigger(
               "t2",
               [],
               () => {
                  log.push("t2");
               },
               true,
            );
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <div controller={TestController} />
         </cx>,
      );

      let tree = component.toJSON();
      assert.deepEqual(log, ["t1", "c1", "t2"]);
   });

   it("is recreated if a component is hidden and shown", () => {
      let initCount = 0;

      class TestController extends Controller {
         onInit() {
            initCount++;
         }
      }

      let store = new Store();
      store.set("visible", true);

      const component = createTestRenderer(
         store,
         <cx>
            <div visible={bind("visible")} controller={TestController} />
         </cx>,
      );

      let tree1 = component.toJSON();
      assert.equal(initCount, 1);

      store.set("visible", false);
      let tree2 = component.toJSON();
      assert.equal(tree2, null);

      store.set("visible", true);
      let tree3 = component.toJSON();
      assert.equal(initCount, 2);
   });

   it("allows creation through a factory", () => {
      let store = new Store({ data: { x: 0 } });

      const controllerFactory = ({ store }: { store: Store }) => {
         return {
            increment() {
               store.update("x", (x: number) => x + 1);
            },
         };
      };

      let c = Controller.create(controllerFactory, { store });

      c.increment();
      assert.equal(store.get("x"), 1);
   });

   it("lifetime methods of a functional controller are properly invoked", () => {
      let initCount = 0,
         destroyCount = 0;

      const testController = () => ({
         onInit() {
            initCount++;
         },

         onDestroy() {
            destroyCount++;
         },
      });

      let store = new Store();
      store.set("visible", true);

      const component = createTestRenderer(
         store,
         <cx>
            <div visible={bind("visible")} controller={testController} />
         </cx>,
      );

      let tree1 = component.toJSON();
      assert.equal(initCount, 1);

      store.set("visible", false);
      let tree2 = component.toJSON();
      assert.equal(destroyCount, 1);

      store.set("visible", true);
      let tree3 = component.toJSON();
      assert.equal(initCount, 2);
   });

   it("widgets can easily define controller methods", () => {
      let store = new Store({ data: { x: 0 } });

      const component = createTestRenderer(
         store,
         <cx>
            <div
               controller={{
                  increment(count: number) {
                     this.store.update("x", (x: number) => x + count);
                  },
               }}
            >
               <div
                  controller={{
                     onInit() {
                        this.invokeParentMethod("increment", 1);
                     },
                  }}
               />
            </div>
         </cx>,
      );

      let tree1 = component.toJSON();
      assert.equal(store.get("x"), 1);
   });

   it("functional controllers get store methods through configuration", () => {
      let store = new Store({ data: { x: 0 } });

      const component = createTestRenderer(
         store,
         <cx>
            <div
               controller={({ update }) => ({
                  increment(count: number) {
                     update("x", (x: number) => x + count);
                  },
               })}
            >
               <div
                  controller={{
                     onInit() {
                        this.invokeParentMethod("increment", 1);
                     },
                  }}
               />
            </div>
         </cx>,
      );

      let tree1 = component.toJSON();
      assert.equal(store.get("x"), 1);
   });

   it("addComputable accepts refs", () => {
      let store = new Store({ data: { x: 0 } });

      const component = createTestRenderer(
         store,
         <cx>
            <div
               controller={({ ref }) => {
                  let x = ref("x");
                  return {
                     onInit() {
                        this.addComputable("y", [x], (x: number) => x + 1);
                     },
                  };
               }}
            />
         </cx>,
      );

      let tree1 = component.toJSON();
      assert.equal(store.get("y"), 1);
   });

   it("invokeParentMethod is invoked on parent instance", () => {
      let testValid: number[] = [];

      class TestController1 extends Controller {
         onInit() {
            this.test();
         }
         test() {
            testValid.push(1);
            this.invokeParentMethod("test", 2);
         }
      }

      class TestController2 extends Controller {
         test(val: number) {
            testValid.push(val);
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <div controller={TestController2}>
               <div controller={TestController1} />
            </div>
         </cx>,
      );

      // let tree = component.toJSON();
      assert.deepStrictEqual(testValid, [1, 2]);
   });
});
