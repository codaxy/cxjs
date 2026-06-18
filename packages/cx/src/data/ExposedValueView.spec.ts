import assert from "assert";

import { Binding } from "./Binding";
import { Store } from "./Store";
import { ExposedValueView } from "./ExposedValueView";

describe("ExposedValueView", () => {
   // Mirrors how Sandbox wires it: a `storage` object keyed by a slot `key`,
   // exposed to children under `recordName` (e.g. "$page").
   const getView = (key = "~/ordering/new") => {
      let store = new Store({
         data: {
            pages: {
               "~/ordering/new": { description: "draft order", count: 3 },
            },
         },
      });

      let view = new ExposedValueView({
         store,
         containerBinding: Binding.get("pages"),
         key,
         recordName: "$page",
      });

      return { store, view };
   };

   it("exposes the keyed slot under the record name", () => {
      let { view } = getView();
      assert.equal(view.get("$page.description"), "draft order");
      assert.equal(view.get("$page.count"), 3);
   });

   it("writes back to the keyed slot on set", () => {
      let { store, view } = getView();
      view.set("$page.description", "edited");
      assert.equal(store.get("pages")["~/ordering/new"].description, "edited");
   });

   it("deletes a property within the exposed record", () => {
      let { store, view } = getView();
      view.delete("$page.count");
      assert.equal(view.get("$page.count"), undefined);
      assert.ok(!store.get("pages")["~/ordering/new"].hasOwnProperty("count"));
   });

   it("deletes the entire exposed record (removes the keyed slot)", () => {
      let { store, view } = getView();
      view.delete("$page");
      assert.equal(view.get("$page"), undefined);
      assert.ok(
         !store.get("pages").hasOwnProperty("~/ordering/new"),
         "the keyed storage slot should be removed"
      );
   });
});
