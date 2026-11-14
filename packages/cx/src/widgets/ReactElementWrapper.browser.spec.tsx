import { describe, it } from "vitest";
import { Store } from "../data/Store";
import assert from "assert";
import { render, settle, markup } from "../util/test/render";
import { VDOM } from "../ui/Widget";
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
   it("renders React components as tag", async () => {
      class MyReactComponent extends VDOM.Component<any> {
         render() {
            return VDOM.createElement("div", { className: "my-component" }, this.props.children);
         }
      }

      let store = new Store();

      const screen = await render(
         <cx>
            <MyReactComponent>
               <span>Child content</span>
            </MyReactComponent>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div class="my-component">
               <span>Child content</span>
            </div>
         `,
      );
   });

   it("renders React function components with props", async () => {
      let store = new Store();

      const screen = await render(
         <cx>
            <ReactFunctionComponent title="Test Title">
               <span>Child content</span>
            </ReactFunctionComponent>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div class="react-function-component">
               <h3>Test Title</h3>
               <div class="content">
                  <span>Child content</span>
               </div>
            </div>
         `,
      );
   });

   it("renders React function components with hooks", async () => {
      let store = new Store();

      const screen = await render(
         <cx>
            <ReactCounterComponent initialCount={5} />
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div class="react-counter">
               <span class="count">5</span>
               <button>Increment</button>
            </div>
         `,
      );
   });

   it("renders React class components with props", async () => {
      let store = new Store();

      const screen = await render(
         <cx>
            <ReactClassComponent label="Test Label">
               <span>Class child content</span>
            </ReactClassComponent>
         </cx>,
         { store },
      );

      assert.equal(screen.container.children.length, 1, "Expected single element");
      let root = screen.container.children[0];
      assert.equal(root.localName, "div");
      assert(root.classList.contains("react-class-component"), "Expected react-class-component class");
      assert.equal(root.children.length, 2, "Expected two children (label and div)");

      let [label, body] = root.children;
      assert.equal(label.outerHTML, "<label>Test Label</label>");
      assert.equal(body.outerHTML, '<div class="body"><span>Class child content</span></div>');
   });

   it("renders React PureComponent", async () => {
      let store = new Store();

      const screen = await render(
         <cx>
            <ReactPureComponent value="Pure Value" />
         </cx>,
         { store },
      );

      assert.equal(screen.html(), '<span class="react-pure-component">Pure Value</span>');
   });

   it("renders React function component with useRef and useEffect", async () => {
      let store = new Store();
      let mountedElement: HTMLDivElement | null = null;

      const screen = await render(
         <cx>
            <ReactRefEffectComponent
               onMount={(el) => {
                  mountedElement = el;
               }}
            />
         </cx>,
         { store },
      );

      assert.equal(screen.container.children.length, 1, "Expected single element");
      let root = screen.container.children[0];
      assert.equal(root.localName, "div");
      assert.equal(root.className, "react-ref-effect-component");
      assert.equal(root.textContent, "Component with ref and effect");
   });

   it("renders React function component with useEffect that updates state", async () => {
      let store = new Store();

      const screen = await render(
         <cx>
            <ReactEffectStateComponent value="Test" />
         </cx>,
         { store },
      );

      assert.equal(screen.container.children.length, 1, "Expected single element");
      let root = screen.container.children[0];
      assert.equal(root.localName, "div");
      assert.equal(root.className, "react-effect-state-component");
      assert.equal(root.children.length, 2, "Expected two children");
      // After rendering, useEffect has run and updated the state
      assert.equal(root.children[0].outerHTML, '<span class="processed">Processed: Test</span>');
   });

   it("translates CxJS accessor bindings to React component props", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div class="react-props-component">
               <span class="text">Bound Text</span>
               <span class="count">42</span>
               <span class="enabled">yes</span>
               <span class="tags">a, b, c</span>
            </div>
         `,
      );
   });

   it("supports visible prop on React components", async () => {
      interface StoreModel {
         show: boolean;
      }

      let $store = createAccessorModelProxy<StoreModel>();

      let store = new Store<StoreModel>({
         data: {
            show: false,
         },
      });

      const screen = await render(
         <cx>
            <div>
               <ReactFunctionComponent title="Visible Test" visible={$store.show} />
               <span>Always visible</span>
            </div>
         </cx>,
         { store },
      );

      // When visible=false, the React component should not render
      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Always visible</span>
            </div>
         `,
      );

      // Update store to make component visible
      await settle(() => store.set("show", true));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <div class="react-function-component">
                  <h3>Visible Test</h3>
                  <div class="content"></div>
               </div>
               <span>Always visible</span>
            </div>
         `,
      );
   });

   it("supports controller prop on React components", async () => {
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

      const screen = await render(
         <cx>
            <ReactPropsComponent text={$store.text} count={10} enabled={true} controller={TestController} />
         </cx>,
         { store },
      );

      assert.equal(controllerInitialized, true, "Controller should be initialized");
      assert.equal(
         screen.html(),
         markup`
            <div class="react-props-component">
               <span class="text">Controller Test</span>
               <span class="count">10</span>
               <span class="enabled">yes</span>
            </div>
         `,
      );
   });

   it("updates React component when bound store data changes", async () => {
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

      const screen = await render(
         <cx>
            <ReactPropsComponent text={$store.text} count={$store.count} enabled={$store.enabled} />
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div class="react-props-component">
               <span class="text">Initial</span>
               <span class="count">1</span>
               <span class="enabled">no</span>
            </div>
         `,
      );

      // Update store
      await settle(() => {
         store.set("text", "Updated");
         store.set("count", 99);
         store.set("enabled", true);
      });

      assert.equal(
         screen.html(),
         markup`
            <div class="react-props-component">
               <span class="text">Updated</span>
               <span class="count">99</span>
               <span class="enabled">yes</span>
            </div>
         `,
      );
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

      it("provides instance through this", () => {
         class TestController extends Controller {
            change(_v: number) {}
         }
         const widget = (
            <cx>
               <RequiredPropsComponent
                  label={"label"}
                  value={100}
                  controller={TestController}
                  onChange={function (v) {
                     this.getControllerByType(TestController).change(v);
                  }}
               />
            </cx>
         );
         assert.ok(widget);
      });
   });
});
