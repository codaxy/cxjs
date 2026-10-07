import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { createTestRenderer } from "../../util/test/createTestRenderer";
import { TextField } from "./TextField";
import { LabeledContainer } from "./LabeledContainer";
import assert from "assert";

interface Model {
   name: string;
   caption: string;
   hint: string;
}

function collectText(node: any): string {
   if (node == null) return "";
   if (typeof node === "string") return node;
   if (Array.isArray(node)) return node.map(collectText).join("");
   return collectText(node.children);
}

describe("Field", () => {
   const m = createModel<Model>();

   it("accepts an accessor chain as label", async () => {
      let store = new Store({ data: { caption: "Full name" } });
      let component = await createTestRenderer(store, <TextField value={m.name} label={m.caption} />);
      assert.ok(collectText(component.toJSON()).includes("Full name"));
   });

   it("accepts an accessor chain as help", async () => {
      let store = new Store({ data: { hint: "As on your passport" } });
      let component = await createTestRenderer(store, <TextField value={m.name} help={m.hint} />);
      assert.ok(collectText(component.toJSON()).includes("As on your passport"));
   });
});

describe("LabeledContainer", () => {
   const m = createModel<Model>();

   it("accepts an accessor chain as label", async () => {
      let store = new Store({ data: { caption: "Contact" } });
      let component = await createTestRenderer(
         store,
         <LabeledContainer label={m.caption}>
            <TextField value={m.name} />
         </LabeledContainer>,
      );
      assert.ok(collectText(component.toJSON()).includes("Contact"));
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

// Documents how a field's value binding style affects store initialization
// (StructuredSelector.getSelectorConfig): a binding OBJECT ({bind: ...})
// collects the widget's declared prop default — Field's emptyValue, i.e.
// null — into defaultValues, and StructuredSelector.init() writes it into
// the store. An accessor-chain binding takes the isAccessorChain branch,
// which registers the selector without any default, so the slot stays
// undefined until the user interacts. Empty form fields therefore hold
// null or undefined depending solely on how the binding was authored.
describe("Field value binding initialization", () => {
   const m = createModel<InitModel>();

   it("seeds the store with null for a {bind} object", async () => {
      let store = new Store();
      await createTestRenderer(store, <TextField value={{ bind: "$page.boundObject" }} />);
      assert.strictEqual(store.get("$page.boundObject"), null);
      assert.ok("boundObject" in store.get("$page"));
   });

   it("seeds the store with null for a {bind} object regardless of debounce", async () => {
      let store = new Store();
      await createTestRenderer(store, <TextField value={{ bind: "$page.boundObjectDebounced", debounce: 500 }} />);
      assert.strictEqual(store.get("$page.boundObjectDebounced"), null);
   });

   it("leaves the store slot undefined for an accessor-chain binding", async () => {
      let store = new Store();
      await createTestRenderer(store, <TextField value={m.$page.chain} />);
      assert.strictEqual(store.get(m.$page.chain), undefined);
      let page = store.get("$page");
      assert.ok(page == null || !("chain" in page));
   });

   it("seeds the declared emptyValue, proving the default comes from the widget's prop declaration", async () => {
      let store = new Store();
      await createTestRenderer(store, <TextField value={{ bind: "$page.customEmpty" }} emptyValue="" />);
      assert.strictEqual(store.get("$page.customEmpty"), "");
   });
});
