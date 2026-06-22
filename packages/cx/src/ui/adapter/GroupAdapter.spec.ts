import assert from "assert";
import { Store } from "../../data";
import { GroupAdapter, GroupingConfig } from "./GroupAdapter";

function collectKeys(
   obj: any,
   path = "",
   result: Record<string, boolean> = {},
   seen = new WeakSet(),
): Record<string, boolean> {
   if (!obj || typeof obj !== "object" || seen.has(obj)) return result;
   seen.add(obj);
   for (const key of Object.keys(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      result[fullPath] = true;
      collectKeys(obj[key], fullPath, result, seen);
   }
   return result;
}

describe("GroupAdapter", () => {
   it("should not mutate grouping config during groupBy", () => {
      const groupingConfig: GroupingConfig[] = [
         {
            key: { city: { bind: "$record.city" } },
            aggregates: {
               count: { type: "count", value: 1 },
            },
         },
      ];

      const keysBefore = collectKeys(groupingConfig);

      const adapter = new GroupAdapter();
      adapter.groupBy(groupingConfig);

      const keysAfter = collectKeys(groupingConfig);
      const newKeys = Object.keys(keysAfter).filter((k) => !keysBefore[k]);

      assert.deepStrictEqual(newKeys, [], `Grouping config was mutated. New keys: ${newKeys.join(", ")}`);
   });

   // Region totals after aggregation: A=10, B=30, C=20.
   const records = [
      { region: "A", sales: 10, product: "p3" },
      { region: "B", sales: 30, product: "p1" },
      { region: "C", sales: 20, product: "p2" },
   ];

   const baseGrouping: GroupingConfig = {
      key: { region: { bind: "$record.region" } },
      aggregates: { total: { type: "sum", value: { bind: "$record.sales" } } },
   };

   // Runs the full grouping pipeline and returns the resulting group order (region keys).
   function groupOrder(grouping: GroupingConfig[], options?: { sortGroupsBySorters?: boolean }, sorters?: any[]) {
      const adapter = new GroupAdapter({ groupings: grouping, ...options });
      adapter.init();
      if (sorters) adapter.sort(sorters);
      const result = adapter.getRecords({} as any, {} as any, records, new Store({ data: {} }));
      return result.filter((r) => r.type === "group-header").map((r: any) => r.group.region);
   }

   it("sorts groups by an aggregate via sortField/sortDirection", () => {
      assert.deepStrictEqual(groupOrder([{ ...baseGrouping, sortField: "total", sortDirection: "DESC" }]), [
         "B",
         "C",
         "A",
      ]);
   });

   it("sorts groups by a key field via sortField", () => {
      assert.deepStrictEqual(groupOrder([{ ...baseGrouping, sortField: "region", sortDirection: "DESC" }]), [
         "C",
         "B",
         "A",
      ]);
   });

   it("supports a multi-field sorters array", () => {
      assert.deepStrictEqual(groupOrder([{ ...baseGrouping, sorters: [{ field: "total", direction: "ASC" }] }]), [
         "A",
         "C",
         "B",
      ]);
   });

   it("defaults to ascending sort by key", () => {
      assert.deepStrictEqual(groupOrder([baseGrouping]), ["A", "B", "C"]);
   });

   it("lets an explicit comparer win over sortField", () => {
      // Custom comparer sorts groups by total ascending, despite sortField asking for DESC.
      const comparer = (a: any, b: any) => a.aggregates.total - b.aggregates.total;
      assert.deepStrictEqual(groupOrder([{ ...baseGrouping, comparer, sortField: "total", sortDirection: "DESC" }]), [
         "A",
         "C",
         "B",
      ]);
   });

   it("reorders groups by the active column sort when sortGroupsBySorters is set", () => {
      // The record-level value selector must be ignored; the column field drives group order.
      const order = groupOrder([baseGrouping], { sortGroupsBySorters: true }, [
         { field: "total", direction: "DESC", value: () => 999 },
      ]);
      assert.deepStrictEqual(order, ["B", "C", "A"]);
   });

   it("keeps configured group order when the sorted column is not a group field", () => {
      // `product` is neither a key nor an aggregate, so groups keep their default (key ASC) order.
      const order = groupOrder([baseGrouping], { sortGroupsBySorters: true }, [
         { field: "product", direction: "DESC" },
      ]);
      assert.deepStrictEqual(order, ["A", "B", "C"]);
   });
});
