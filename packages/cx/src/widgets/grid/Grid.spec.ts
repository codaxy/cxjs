import assert from "assert";
import { Grid } from "./Grid";
import { Widget } from "../../ui/Widget";

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

describe("Grid", () => {
   it("should not mutate columns config during init", () => {
      const config = {
         type: Grid,
         records: { bind: "records" },
         columns: [
            { header: "Name", field: "name" },
            { header: "City", field: "city" },
         ],
      };

      const keysBefore = collectKeys(config);

      const widget = Widget.create(config) as Grid;
      widget.init();

      const keysAfter = collectKeys(config);
      const newKeys = Object.keys(keysAfter).filter((k) => !keysBefore[k]);

      assert.deepStrictEqual(newKeys, [], `Config was mutated. New keys: ${newKeys.join(", ")}`);
   });
});
