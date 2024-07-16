import assert from "assert";
import { ArrayElementView } from "./ArrayElementView";
import { getAccessor } from "./getAccessor";
import { Store } from "./Store";

describe("ArrayElementView", function () {
   it("exposes the element as under the $record alias", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters } });
      let elementView = new ArrayElementView({ store, itemIndex: 1, arrayAccessor: getAccessor({ bind: "letters" }) });
      let record = elementView.get("$record");
      assert.equal(record, letters[1]);
   });

   it("changes of the $record are propagated", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters } });
      let elementView = new ArrayElementView({ store, itemIndex: 1, arrayAccessor: getAccessor({ bind: "letters" }) });
      elementView.set("$record.letter", "C");
      assert.deepEqual(store.get("letters"), [letters[0], { letter: "C" }]);
   });

   it("removes the element if the $record is deleted", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters } });
      let elementView = new ArrayElementView({ store, itemIndex: 1, arrayAccessor: getAccessor({ bind: "letters" }) });
      elementView.delete("$record");
      assert.deepEqual(store.get("letters"), [...letters[0]]);
   });

   it("exposes the element as under the given alias", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters } });
      let elementView = new ArrayElementView({
         store,
         itemIndex: 1,
         arrayAccessor: getAccessor({ bind: "letters" }),
         recordAlias: "$letter",
      });
      let record = elementView.get("$letter");
      assert.equal(record, letters[1]);
   });

   it("aliases allow nesting", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters } });
      let elementView = new ArrayElementView({
         store,
         itemIndex: 1,
         arrayAccessor: getAccessor({ bind: "letters" }),
         recordAlias: "$iter.letter",
         indexAlias: "$iter.index.letter",
      });
      let record = elementView.get("$iter.letter");
      assert.equal(record, letters[1]);
      assert.equal(elementView.get("$iter.index.letter"), 1);

      elementView.set("$iter.letter.letter", "C");
      assert.equal(store.get("letters.1.letter"), "C");
   });

   it("when immutable preserves the parent data object", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters } });
      let elementView = new ArrayElementView({
         store,
         itemIndex: 1,
         arrayAccessor: getAccessor({ bind: "letters" }),
         immutable: true,
      });
      let record = elementView.get("$record");
      assert.equal(record, letters[1]);
      assert(!store.getData().hasOwnProperty("$record"));
   });

   it("respects the parent's store sealed flag", function () {
      let letters = [{ letter: "A" }, { letter: "B" }];
      let store = new Store({ data: { letters }, sealed: true });
      let elementView = new ArrayElementView({
         store,
         itemIndex: 1,
         arrayAccessor: getAccessor({ bind: "letters" }),
      });
      let record = elementView.get("$record");
      assert.equal(record, letters[1]);
      assert(!store.getData().hasOwnProperty("$record"));
   });
});
