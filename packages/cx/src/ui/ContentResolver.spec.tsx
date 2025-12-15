import { ContentResolver } from "./ContentResolver";
import { Store } from "../data/Store";
import { createTestRenderer } from "../util/test/createTestRenderer";
import assert from "assert";
import { bind } from "./bind";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";
import { Prop } from "./Prop";

interface TestModel {
   user: {
      name: string;
      age: number;
      active: boolean;
   };
}

describe("ContentResolver", () => {
   it("resolves content based on params", () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{ name: bind("name") }}
                  onResolve={(params) => <span text={params.name} />}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            name: "Test",
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Test"],
            },
         ],
      });
   });

   it("re-resolves when params change", () => {
      let resolveCount = 0;

      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{ value: bind("value") }}
                  onResolve={(params) => {
                     resolveCount++;
                     return <span text={String(params.value)} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            value: 1,
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["1"],
            },
         ],
      });
      assert.equal(resolveCount, 1);

      store.set("value", 2);
      tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["2"],
            },
         ],
      });
      assert.equal(resolveCount, 2);
   });

   it("does not re-resolve if params are unchanged", () => {
      let resolveCount = 0;

      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{ value: bind("value") }}
                  onResolve={(params) => {
                     resolveCount++;
                     return <span text={String(params.value)} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            value: 1,
            other: "a",
         },
      });

      const component = createTestRenderer(store, widget);
      assert.equal(resolveCount, 1);

      // Change unrelated data
      store.set("other", "b");
      component.toJSON();
      assert.equal(resolveCount, 1);
   });

   it("supports literal values in params", () => {
      let receivedParams: any = null;

      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{ count: 42, name: "test" }}
                  onResolve={(params) => {
                     receivedParams = params;
                     return <span text={`${params.name}: ${params.count}`} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store();

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["test: 42"],
            },
         ],
      });
      assert.equal(receivedParams.count, 42);
      assert.equal(receivedParams.name, "test");
   });

   it("supports mode=prepend", () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  mode="prepend"
                  params={{ show: true }}
                  onResolve={() => <span>Prepended</span>}
               >
                  <span>Original</span>
               </ContentResolver>
            </div>
         </cx>
      );

      let store = new Store();

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Prepended"],
            },
            {
               type: "span",
               props: {},
               children: ["Original"],
            },
         ],
      });
   });

   it("supports mode=append", () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  mode="append"
                  params={{ show: true }}
                  onResolve={() => <span>Appended</span>}
               >
                  <span>Original</span>
               </ContentResolver>
            </div>
         </cx>
      );

      let store = new Store();

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Original"],
            },
            {
               type: "span",
               props: {},
               children: ["Appended"],
            },
         ],
      });
   });

   it("supports mode=replace (default)", () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver params={{ show: true }} onResolve={() => <span>Replaced</span>}>
                  <span>Original</span>
               </ContentResolver>
            </div>
         </cx>
      );

      let store = new Store();

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Replaced"],
            },
         ],
      });
   });

   it("handles async resolution with Promise", async () => {
      let resolvePromise: ((value: any) => void) | null = null;

      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{ id: bind("id") }}
                  loading={bind("loading")}
                  onResolve={(params) => {
                     return new Promise((resolve) => {
                        resolvePromise = resolve;
                     });
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            id: 1,
            loading: false,
         },
      });

      const component = createTestRenderer(store, widget);

      // Initially loading should be true
      assert.equal(store.get("loading"), true);

      // Resolve the promise
      resolvePromise!(<span>Loaded Content</span>);

      // Wait for promise resolution
      await new Promise((r) => setTimeout(r, 10));

      // After resolution, loading should be false
      assert.equal(store.get("loading"), false);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Loaded Content"],
            },
         ],
      });
   });

   it("supports typed params with accessor chains", () => {
      const model = createAccessorModelProxy<TestModel>();

      // This test verifies type inference works correctly.
      // AccessorChain<T> resolves to T in the onResolve params.
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{
                     name: model.user.name,
                     age: model.user.age,
                     active: model.user.active,
                  }}
                  onResolve={(params) => {
                     // TypeScript infers types from AccessorChain<T>:
                     // params.name is string (from AccessorChain<string>)
                     // params.age is number (from AccessorChain<number>)
                     // params.active is boolean (from AccessorChain<boolean>)
                     const name: string = params.name;
                     const age: number = params.age;
                     const active: boolean = params.active;
                     return (
                        <span
                           text={`${name} is ${age} years old and ${active ? "active" : "inactive"}`}
                        />
                     );
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            user: {
               name: "John",
               age: 30,
               active: true,
            },
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["John is 30 years old and active"],
            },
         ],
      });
   });

   it("infers types from literal params", () => {
      // When using literal values, TypeScript can infer their types
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{ count: 42, label: "items" }}
                  onResolve={(params) => {
                     // params.count is inferred as number
                     // params.label is inferred as string
                     const count: number = params.count;
                     const label: string = params.label;
                     return <span text={`${count} ${label}`} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store();

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["42 items"],
            },
         ],
      });
   });

   it("supports simple Prop params (non-structured)", () => {
      const model = createAccessorModelProxy<TestModel>();

      // Test using a single AccessorChain as params instead of an object
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={model.user.name}
                  onResolve={(name) => {
                     // name should be typed as string (from AccessorChain<string>)
                     const typedName: string = name;
                     return <span text={`Hello, ${typedName}!`} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            user: {
               name: "Alice",
               age: 25,
               active: true,
            },
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Hello, Alice!"],
            },
         ],
      });
   });

   it("supports simple bind() as params", () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={bind("count")}
                  onResolve={(count) => {
                     return <span text={`Count: ${count}`} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            count: 42,
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Count: 42"],
            },
         ],
      });
   });

   it("resolves Prop<string> to string (not any)", () => {
      const model = createAccessorModelProxy<TestModel>();

      // When params is typed as Prop<string>, onResolve should receive string (not any)
      // This tests that the union type Prop<T> correctly extracts T
      const typedParam: Prop<string> = model.user.name;

      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={typedParam}
                  onResolve={(name) => {
                     // name should be typed as string, not any
                     const typedName: string = name;
                     return <span text={`Hello, ${typedName}!`} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            user: {
               name: "Bob",
               age: 35,
               active: false,
            },
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Hello, Bob!"],
            },
         ],
      });
   });
});
