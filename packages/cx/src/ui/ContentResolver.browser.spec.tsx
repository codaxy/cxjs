import { describe, expect, it } from "vitest";
import { ContentResolver } from "./ContentResolver";
import { Store } from "../data/Store";
import { render, settle, markup } from "../util/test/render";
import assert from "assert";
import { bind } from "./bind";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";
import { Prop } from "./Prop";
import { stringTemplate } from "../data/StringTemplate";

interface TestModel {
   user: {
      name: string;
      age: number;
      active: boolean;
   };
}

describe("ContentResolver", () => {
   it("resolves content based on params", async () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver params={{ name: bind("name") }} onResolve={(params) => <span text={params.name} />} />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            name: "Test",
         },
      });

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Test</span>
            </div>
         `,
      );
   });

   it("re-resolves when params change", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>1</span>
            </div>
         `,
      );
      assert.equal(resolveCount, 1);

      await settle(() => store.set("value", 2));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>2</span>
            </div>
         `,
      );
      assert.equal(resolveCount, 2);
   });

   it("does not re-resolve if params are unchanged", async () => {
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

      await render(widget, { store });
      assert.equal(resolveCount, 1);

      // Change unrelated data
      await settle(() => store.set("other", "b"));
      assert.equal(resolveCount, 1);
   });

   it("supports literal values in params", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>test: 42</span>
            </div>
         `,
      );
      assert.equal(receivedParams.count, 42);
      assert.equal(receivedParams.name, "test");
   });

   it("supports mode=prepend", async () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver mode="prepend" params={{ show: true }} onResolve={() => <span>Prepended</span>}>
                  <span>Original</span>
               </ContentResolver>
            </div>
         </cx>
      );

      let store = new Store();

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Prepended</span>
               <span>Original</span>
            </div>
         `,
      );
   });

   it("supports mode=append", async () => {
      let widget = (
         <cx>
            <div>
               <ContentResolver mode="append" params={{ show: true }} onResolve={() => <span>Appended</span>}>
                  <span>Original</span>
               </ContentResolver>
            </div>
         </cx>
      );

      let store = new Store();

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Original</span>
               <span>Appended</span>
            </div>
         `,
      );
   });

   it("supports mode=replace (default)", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Replaced</span>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      // Initially loading should be true
      assert.equal(store.get("loading"), true);

      // Resolve the promise; the content renders asynchronously
      resolvePromise!(<span>Loaded Content</span>);
      await expect.poll(() => screen.html()).toBe(markup`
         <div>
            <span>Loaded Content</span>
         </div>
      `);

      // After resolution, loading should be false
      assert.equal(store.get("loading"), false);
   });

   it("supports typed params with accessor chains", async () => {
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
                     return <span text={`${name} is ${age} years old and ${active ? "active" : "inactive"}`} />;
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>John is 30 years old and active</span>
            </div>
         `,
      );
   });

   it("infers types from literal params", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>42 items</span>
            </div>
         `,
      );
   });

   it("supports simple Prop params (non-structured)", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Hello, Alice!</span>
            </div>
         `,
      );
   });

   it("supports simple bind() as params", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Count: 42</span>
            </div>
         `,
      );
   });

   it("resolves Selector<string> | null to string | null", async () => {
      const text: string | null = "Hello {user.name}";

      let widget = (
         <cx>
            <div>
               <ContentResolver
                  params={{
                     text: text ? stringTemplate(text) : null,
                  }}
                  onResolve={(params) => {
                     // params.text should be string | null
                     const typedText: string | null = params.text;
                     // @ts-expect-error - params.text should not be 'any' or broader type
                     const shouldFail: number = params.text;
                     return <span text={typedText ?? "no text"} />;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            user: { name: "World", age: 30, active: true },
         },
      });

      const screen = await render(widget, { store });
      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Hello World</span>
            </div>
         `,
      );
   });

   it("resolves Prop<string> to string (not any)", async () => {
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Hello, Bob!</span>
            </div>
         `,
      );
   });
});
