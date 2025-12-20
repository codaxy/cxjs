import { Store } from "../data/Store";
import assert from "assert";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { VDOM } from "../ui/Widget";
import { act } from "react-test-renderer";
import {
   ReactFunctionComponent,
   ReactCounterComponent,
   ReactClassComponent,
   ReactPureComponent,
   ReactRefEffectComponent,
   ReactEffectStateComponent,
   ReactPropsComponent,
} from "./HtmlElement.spec.helpers";
import { Controller } from "../ui/Controller";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";
import { ReactElementWrapper } from "./ReactElementWrapper";

describe("ReactElementWrapper", () => {
   it("renders React components as tag", () => {
      class MyReactComponent extends VDOM.Component<any> {
         render() {
            return VDOM.createElement("div", { className: "my-component" }, this.props.children);
         }
      }

      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <MyReactComponent>
               <span>Child content</span>
            </MyReactComponent>
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.equal(tree.props.className, "my-component");
      assert(tree.children && tree.children.length === 1, "Expected one child");
   });

   it("renders React function components with props", () => {
      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <ReactFunctionComponent title="Test Title">
               <span>Child content</span>
            </ReactFunctionComponent>
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.equal(tree.props.className, "react-function-component");
      assert(tree.children && tree.children.length === 2, "Expected two children (h3 and div)");

      let h3 = tree.children[0] as any;
      assert.equal(h3.type, "h3");
      assert.deepEqual(h3.children, ["Test Title"]);

      let contentDiv = tree.children[1] as any;
      assert.equal(contentDiv.type, "div");
      assert.equal(contentDiv.props.className, "content");
   });

   it("renders React function components with hooks", () => {
      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <ReactCounterComponent initialCount={5} />
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.equal(tree.props.className, "react-counter");
      assert(tree.children && tree.children.length === 2, "Expected two children (span and button)");

      let span = tree.children[0] as any;
      assert.equal(span.type, "span");
      assert.equal(span.props.className, "count");
      assert.deepEqual(span.children, ["5"]);

      let button = tree.children[1] as any;
      assert.equal(button.type, "button");
   });

   it("renders React class components with props", () => {
      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <ReactClassComponent label="Test Label">
               <span>Class child content</span>
            </ReactClassComponent>
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert(tree.props.className.includes("react-class-component"), "Expected react-class-component class");

      assert(tree.children && tree.children.length === 2, "Expected two children (label and div)");

      let label = tree.children[0] as any;
      assert.equal(label.type, "label");
      assert.deepEqual(label.children, ["Test Label"]);

      let bodyDiv = tree.children[1] as any;
      assert.equal(bodyDiv.type, "div");
      assert.equal(bodyDiv.props.className, "body");
   });

   it("renders React PureComponent", () => {
      let store = new Store();

      const component = createTestRenderer(
         store,
         <cx>
            <ReactPureComponent value="Pure Value" />
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "span");
      assert.equal(tree.props.className, "react-pure-component");
      assert.deepEqual(tree.children, ["Pure Value"]);
   });

   it("renders React function component with useRef and useEffect", () => {
      let store = new Store();
      let mountedElement: HTMLDivElement | null = null;

      const component = createTestRenderer(
         store,
         <cx>
            <ReactRefEffectComponent
               onMount={(el: HTMLDivElement | null) => {
                  mountedElement = el;
               }}
            />
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.equal(tree.props.className, "react-ref-effect-component");
      assert.deepEqual(tree.children, ["Component with ref and effect"]);
   });

   it("renders React function component with useEffect that updates state", () => {
      let store = new Store();
      let component: ReturnType<typeof createTestRenderer>;

      act(() => {
         component = createTestRenderer(
            store,
            <cx>
               <ReactEffectStateComponent value="Test" />
            </cx>,
         );
      });

      let tree = component!.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.equal(tree.props.className, "react-effect-state-component");
      assert(tree.children && tree.children.length === 2, "Expected two children");

      let processedSpan = tree.children[0] as any;
      assert.equal(processedSpan.type, "span");
      assert.equal(processedSpan.props.className, "processed");
      // After act(), useEffect should have run and updated state
      assert.deepEqual(processedSpan.children, ["Processed: Test"]);
   });

   it("translates CxJS accessor bindings to React component props", () => {
      interface StoreModel {
         text: string;
         count: number;
         enabled: boolean;
         tags: string[];
      }

      let $store = createAccessorModelProxy<StoreModel>();

      // First verify jsx transform output
      const widget = (
         <cx>
            <ReactPropsComponent text={$store.text} count={$store.count} enabled={$store.enabled} tags={$store.tags} />
         </cx>
      );

      assert.equal(widget.$type, ReactElementWrapper, "React component should use ReactElementWrapper as $type");
      assert.equal(widget.componentType, ReactPropsComponent, "React component should be set as componentType");
      assert.equal(typeof widget.text, "function", "Accessor chain text should be a function");
      assert.equal(widget.text.toString(), "text", "Accessor chain text should resolve to path");

      // Now verify rendering
      let store = new Store<StoreModel>({
         data: {
            text: "Bound Text",
            count: 42,
            enabled: true,
            tags: ["a", "b", "c"],
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");

      let textSpan = tree.children![0] as any;
      assert.deepEqual(textSpan.children, ["Bound Text"]);

      let countSpan = tree.children![1] as any;
      assert.deepEqual(countSpan.children, ["42"]);

      let enabledSpan = tree.children![2] as any;
      assert.deepEqual(enabledSpan.children, ["yes"]);

      let tagsSpan = tree.children![3] as any;
      assert.deepEqual(tagsSpan.children, ["a, b, c"]);
   });

   it("supports visible prop on React components", () => {
      interface StoreModel {
         show: boolean;
      }

      let $store = createAccessorModelProxy<StoreModel>();

      let store = new Store<StoreModel>({
         data: {
            show: false,
         },
      });

      const component = createTestRenderer(
         store,
         <cx>
            <div>
               <ReactFunctionComponent title="Visible Test" visible={$store.show} />
               <span>Always visible</span>
            </div>
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      // When visible=false, the React component should not render
      assert.equal(tree.children!.length, 1, "Expected only the span to be visible");
      assert.equal((tree.children![0] as any).type, "span");

      // Update store to make component visible
      store.set("show", true);
      let tree2 = component.toJSON();
      assert(tree2 && !Array.isArray(tree2), "Expected single element");
      assert.equal(tree2.children!.length, 2, "Expected both children to be visible");
   });

   it("supports controller prop on React components", () => {
      let controllerInitialized = false;

      class TestController extends Controller {
         onInit() {
            controllerInitialized = true;
         }
      }

      interface StoreModel {
         text: string;
      }

      let $store = createAccessorModelProxy<StoreModel>();

      let store = new Store<StoreModel>({
         data: {
            text: "Controller Test",
         },
      });

      const component = createTestRenderer(
         store,
         <cx>
            <ReactPropsComponent text={$store.text} count={10} enabled={true} controller={TestController} />
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(controllerInitialized, true, "Controller should be initialized");

      let textSpan = tree.children![0] as any;
      assert.deepEqual(textSpan.children, ["Controller Test"]);
   });

   it("updates React component when bound store data changes", () => {
      interface StoreModel {
         text: string;
         count: number;
         enabled: boolean;
      }

      let $store = createAccessorModelProxy<StoreModel>();

      let store = new Store<StoreModel>({
         data: {
            text: "Initial",
            count: 1,
            enabled: false,
         },
      });

      const component = createTestRenderer(
         store,
         <cx>
            <ReactPropsComponent text={$store.text} count={$store.count} enabled={$store.enabled} />
         </cx>,
      );

      let tree1 = component.toJSON() as any;
      assert.deepEqual(tree1.children[0].children, ["Initial"]);
      assert.deepEqual(tree1.children[1].children, ["1"]);
      assert.deepEqual(tree1.children[2].children, ["no"]);

      // Update store
      store.set("text", "Updated");
      store.set("count", 99);
      store.set("enabled", true);

      let tree2 = component.toJSON() as any;
      assert.deepEqual(tree2.children[0].children, ["Updated"]);
      assert.deepEqual(tree2.children[1].children, ["99"]);
      assert.deepEqual(tree2.children[2].children, ["yes"]);
   });

   describe("React component type inference", () => {
      interface RequiredPropsComponentProps {
         label: string;
         value: number;
         onChange: (value: number) => void;
         disabled?: boolean;
      }

      function RequiredPropsComponent(_props: RequiredPropsComponentProps) {
         return null;
      }

      it("accepts all required props", () => {
         const widget = (
            <cx>
               <RequiredPropsComponent label="Amount" value={100} onChange={(v) => console.log(v)} />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts required props with optional prop", () => {
         const widget = (
            <cx>
               <RequiredPropsComponent label="Amount" value={100} onChange={(v) => console.log(v)} disabled={true} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects missing required prop (label)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - label is required but missing */}
               <RequiredPropsComponent value={100} onChange={(v) => console.log(v)} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects missing required prop (onChange)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - onChange is required but missing */}
               <RequiredPropsComponent label="Amount" value={100} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects missing all required props", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - label, value, and onChange are required but missing */}
               <RequiredPropsComponent disabled={true} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects wrong prop type (string for number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - value should be number, not string */}
               <RequiredPropsComponent label="Amount" value="100" onChange={(v) => console.log(v)} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects wrong prop type (number for string)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - label should be string, not number */}
               <RequiredPropsComponent label={123} value={100} onChange={(v) => console.log(v)} />
            </cx>
         );
         assert.ok(widget);
      });
   });
});
