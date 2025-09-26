import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { TreeAdapter } from "./TreeAdapter";
import assert from "assert";
import { Store } from "../../data";
import { ArrayAdapter } from "./ArrayAdapter";

describe("ArrayAdapter", () => {
   it("maps data into records", () => {
      let adapter = new ArrayAdapter();
      let data = [
         {
            id: 1,
            text: "1",
         },
         {
            id: 2,
            text: "2",
         },
      ];

      let store = new Store();

      let records = adapter.mapRecords(new RenderingContext(), new Instance(null, 1, null, store), data, store, null);

      assert.equal(records.length, 2);
      assert.equal(records[0].data, records[0].store.get("$record"));
      assert.equal(records[1].data, records[1].store.get("$record"));
   });

   it("can sort data", () => {
      let adapter = new ArrayAdapter();

      adapter.sort([{ field: "id", direction: "DESC" }]);

      let data = [
         {
            id: 1,
            text: "1",
         },
         {
            id: 2,
            text: "2",
         },
      ];

      let store = new Store();

      let records = adapter.mapRecords(new RenderingContext(), new Instance(null, 1, null, store), data, store, null);

      assert.equal(records.length, 2);
      assert.equal(data[1], records[0].store.get("$record"));
      assert.equal(data[0], records[1].store.get("$record"));
   });
});
