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
});
