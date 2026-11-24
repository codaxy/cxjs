import { describe, it } from "vitest";
import { sorter } from "./comparer";
import assert from "assert";

describe("comparer", function () {
   describe("sorter", function () {
      it("orders by numeric values ASC", function () {
         let records = [
            { value: 3, id: 1 },
            { value: -1, id: 2 },
            { value: 2, id: 3 },
            { value: null, id: 4 },
            { value: null, id: 5 },
         ];

         let sort = sorter([{ value: { bind: "value" }, direction: "ASC" }]);

         let sorted = sort(records);

         assert.equal(sorted[0].value, -1);
         assert.equal(sorted[1].value, 2);
         assert.equal(sorted[2].value, 3);
         assert.equal(sorted[3].value, null);
         assert.equal(sorted[4].value, null);
      });

      it("orders by numeric values DESC", function () {
         let records = [
            { value: 3, id: 1 },
            { value: 1, id: 2 },
            { value: -2, id: 3 },
            { value: null, id: 4 },
            { value: null, id: 5 },
         ];

         let sort = sorter([{ value: { bind: "value" }, direction: "DESC" }]);

         let sorted = sort(records);

         assert.equal(sorted[0].value, 3);
         assert.equal(sorted[1].value, 1);
         assert.equal(sorted[2].value, -2);
         assert.equal(sorted[3].value, null);
         assert.equal(sorted[4].value, null);
      });

      it("orders nulls first with nullsFirst, in both directions", function () {
         let records = [{ value: 3 }, { value: null }, { value: 1 }, { value: undefined }, { value: 2 }];

         let asc = sorter([{ field: "value", direction: "ASC", nullsFirst: true }])(records);
         assert.deepEqual(
            asc.map((r) => r.value),
            [null, undefined, 1, 2, 3],
         );

         let desc = sorter([{ field: "value", direction: "DESC", nullsFirst: true }])(records);
         assert.deepEqual(
            desc.map((r) => r.value),
            [null, undefined, 3, 2, 1],
         );
      });

      it("applies nullsFirst only to its own sorter", function () {
         let records = [
            { group: null, value: null, id: 1 },
            { group: 1, value: null, id: 2 },
            { group: null, value: 1, id: 3 },
            { group: 1, value: 1, id: 4 },
         ];

         let sorted = sorter([
            { field: "group", direction: "ASC", nullsFirst: true },
            { field: "value", direction: "ASC" },
         ])(records);
         assert.deepEqual(
            sorted.map((r) => r.id),
            [3, 1, 4, 2],
         );
      });

      it("sorts null values as nullValue, in the sort direction", function () {
         let records = [{ value: 3 }, { value: null }, { value: -1 }, { value: undefined }, { value: 2 }];

         let asc = sorter([{ field: "value", direction: "ASC", nullValue: 0 }])(records);
         assert.deepEqual(
            asc.map((r) => r.value),
            [-1, null, undefined, 2, 3],
         );

         let desc = sorter([{ field: "value", direction: "DESC", nullValue: 0 }])(records);
         assert.deepEqual(
            desc.map((r) => r.value),
            [3, 2, null, undefined, -1],
         );
      });

      it("supports field", function () {
         let records = [
            { value: 3, id: 1 },
            { value: 1, id: 2 },
            { value: 2, id: 3 },
         ];

         let sort = sorter([{ field: "value", direction: "ASC" }]);
         let sorted = sort(records);
         assert.equal(sorted[0].value, 1);
         assert.equal(sorted[1].value, 2);
         assert.equal(sorted[2].value, 3);
      });
   });
});
