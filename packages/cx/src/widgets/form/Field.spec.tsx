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
