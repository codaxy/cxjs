import { describe, it } from "vitest";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { render } from "../../util/test/render";
import { TextField } from "./TextField";
import { LabeledContainer } from "./LabeledContainer";
import assert from "assert";

interface Model {
   name: string;
   caption: string;
   hint: string;
}

describe("Field", () => {
   const m = createModel<Model>();

   it("accepts an accessor chain as label", async () => {
      let store = new Store({ data: { caption: "Full name" } });
      let screen = await render(<TextField value={m.name} label={m.caption} />, { store });
      let label = screen.container.querySelector("label")!;
      assert.equal(label.textContent, "Full name");
      // the label points to the input
      assert.equal(label.htmlFor, screen.container.querySelector("input")!.id);
   });

   it("accepts an accessor chain as help", async () => {
      let store = new Store({ data: { hint: "As on your passport" } });
      let screen = await render(<TextField value={m.name} help={m.hint} />, { store });
      assert.ok(screen.container.textContent!.includes("As on your passport"));
   });
});

describe("LabeledContainer", () => {
   const m = createModel<Model>();

   it("accepts an accessor chain as label", async () => {
      let store = new Store({ data: { caption: "Contact" } });
      let screen = await render(
         <LabeledContainer label={m.caption}>
            <TextField value={m.name} />
         </LabeledContainer>,
         { store },
      );
      assert.equal(screen.container.querySelector("label")?.textContent, "Contact");
   });
});

interface InitModel {
   $page: {
      boundObject?: string;
      boundObjectDebounced?: string;
      chain?: string;
      customEmpty?: string;
   };
}

// A bound field seeds its store slot with the widget's declared prop default
// (Field's emptyValue, i.e. null) on initialization — StructuredSelector
// collects it into defaultValues and init() writes it. Binding objects and
// accessor chains behave the same, so an untouched field holds the same value
// regardless of how the binding was authored (#1337).
describe("Field value binding initialization", () => {
   const m = createModel<InitModel>();

   it("seeds the store with null for a {bind} object", async () => {
      let store = new Store();
      await render(<TextField value={{ bind: "$page.boundObject" }} />, { store });
      assert.strictEqual(store.get("$page.boundObject"), null);
      assert.ok("boundObject" in store.get("$page"));
   });

   it("seeds the store with null for a {bind} object regardless of debounce", async () => {
      let store = new Store();
      await render(<TextField value={{ bind: "$page.boundObjectDebounced", debounce: 500 }} />, { store });
      assert.strictEqual(store.get("$page.boundObjectDebounced"), null);
   });

   it("seeds the store with null for an accessor-chain binding", async () => {
      let store = new Store();
      await render(<TextField value={m.$page.chain} />, { store });
      assert.strictEqual(store.get(m.$page.chain), null);
      assert.ok("chain" in store.get("$page"));
   });

   it("seeds the declared emptyValue, proving the default comes from the widget's prop declaration", async () => {
      let store = new Store();
      await render(<TextField value={{ bind: "$page.customEmpty" }} emptyValue="" />, { store });
      assert.strictEqual(store.get("$page.customEmpty"), "");
   });

   it("seeds the declared emptyValue for an accessor-chain binding", async () => {
      let store = new Store();
      await render(<TextField value={m.$page.customEmpty} emptyValue="" />, { store });
      assert.strictEqual(store.get(m.$page.customEmpty), "");
   });

   it("does not overwrite an existing value", async () => {
      let store = new Store({ data: { $page: { chain: "x", boundObject: "y" } } });
      await render(
         <div>
            <TextField value={m.$page.chain} />
            <TextField value={{ bind: "$page.boundObject" }} />
         </div>,
         { store },
      );
      assert.strictEqual(store.get(m.$page.chain), "x");
      assert.strictEqual(store.get("$page.boundObject"), "y");
   });
});
