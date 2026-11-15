import { describe, it } from "vitest";
import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { TreeAdapter } from "./TreeAdapter";
import assert from "assert";
import { Store } from "../../data";
import { ArrayAdapter, RecordStoreCache } from "./ArrayAdapter";

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

      let records = adapter.mapRecords(new RenderingContext(), new Instance(null!, "1", null!, store), data, store);

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

      let records = adapter.mapRecords(new RenderingContext(), new Instance(null!, "1", null!, store), data, store);

      assert.equal(records.length, 2);
      assert.equal(data[1], records[0].store.get("$record"));
      assert.equal(data[0], records[1].store.get("$record"));
   });

   describe("record stores", () => {
      function setup() {
         let adapter = new ArrayAdapter({ keyField: "id" });
         let store = new Store();
         let instance: Instance & Partial<RecordStoreCache> = new Instance(null!, "1", null!, store);
         let getRecords = (records: { id: number }[]) =>
            adapter.getRecords(new RenderingContext(), instance, records, store);
         return { adapter, store, instance, getRecords };
      }

      // keeps record 0, and replaces the other records with new ones on each change
      function changes(count: number, size: number, onChange: (records: { id: number }[]) => void) {
         let nextId = size;
         let records = Array.from({ length: size }, (_, i) => ({ id: i }));
         for (let i = 0; i < count; i++) {
            records = [records[0], ...records.slice(2), { id: nextId++ }];
            onChange(records);
         }
      }

      it("are dropped for keys that are no longer in the records", () => {
         let { instance, getRecords } = setup();
         changes(1000, 10, (records) => {
            getRecords(records);
            assert.ok(instance.cacheByKey!.size <= 2 * 10 + 32, `${instance.cacheByKey!.size} stores`);
         });
      });

      it("are kept for the records that stay", () => {
         let { getRecords } = setup();
         let first = getRecords([{ id: 0 }, { id: 1 }])[0].store;
         changes(1000, 10, (records) => {
            let store = getRecords(records)[0].store;
            assert.strictEqual(store, first);
            assert.strictEqual(store.get("$record"), records[0]);
         });
      });

      it("are pruned with pruneCache for records mapped on demand", () => {
         let { adapter, store, instance } = setup();
         adapter.initInstance(new RenderingContext(), instance);
         let first = adapter.mapRecord(new RenderingContext(), instance, { id: 0 }, store, undefined, 0).store;
         changes(1000, 10, (records) => {
            // only the last record is shown, as when scrolling through a buffered grid
            adapter.mapRecord(new RenderingContext(), instance, records[records.length - 1], store, undefined, 9);
            adapter.pruneCache(instance, records);
            assert.ok(instance.cacheByKey!.size <= 2 * 10 + 32, `${instance.cacheByKey!.size} stores`);
         });
         assert.strictEqual(instance.cacheByKey!.get(0), first);
      });
   });
});
