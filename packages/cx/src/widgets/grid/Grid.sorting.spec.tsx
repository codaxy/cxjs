import assert from "assert";
import { Store } from "../../data/Store";
import { Grid } from "./Grid";
import { bind } from "../../ui/bind";
import { computable } from "../../data/computable";
import { createTestRenderer, act } from "../../util/test/createTestRenderer";

// priorities 1, 2, 10 sort differently as numbers (1, 2, 10) than their
// "P{priority}" labels do as strings (P1, P10, P2), which makes the sort key
// precedence (sortValue > sortField > value > field) observable in the output
let records = [
   { id: 1, priority: 2 },
   { id: 2, priority: 10 },
   { id: 3, priority: 1 },
];

function textOf(node: any): string {
   if (node == null) return "";
   if (typeof node == "string") return node;
   if (Array.isArray(node)) return node.map(textOf).join("");
   return textOf(node.children);
}

function findAll(node: any, predicate: (el: any) => boolean, result: any[] = []): any[] {
   if (node == null || typeof node == "string") return result;
   if (Array.isArray(node)) {
      node.forEach((child) => findAll(child, predicate, result));
      return result;
   }
   if (predicate(node)) result.push(node);
   findAll(node.children, predicate, result);
   return result;
}

function getRenderedLabels(component: any): string[] {
   let tds = findAll(component.toJSON(), (el) => el.type == "td");
   return tds.map(textOf);
}

async function clickHeader(component: any, text: string) {
   let th = component.root.findAllByType("th").find((t: any) => thText(t) == text);
   assert.ok(th, `Header cell "${text}" not found`);
   await act(async () => {
      th.props.onClick({ preventDefault() {}, stopPropagation() {} });
   });
}

function thText(th: any): string {
   return th.children.map((c: any) => (typeof c == "string" ? c : "")).join("");
}

describe("Grid sorting precedence", () => {
   it("sorts by sortField instead of the displayed value when both are set", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const component = await createTestRenderer(store, widget);

      await clickHeader(component, "Priority");
      assert.deepStrictEqual(getRenderedLabels(component), ["P1", "P2", "P10"]);

      await clickHeader(component, "Priority");
      assert.deepStrictEqual(getRenderedLabels(component), ["P10", "P2", "P1"]);
   });

   it("sortValue takes precedence over sortField", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     sortValue: computable("$record.priority", (p: number) => -p),
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const component = await createTestRenderer(store, widget);

      await clickHeader(component, "Priority");
      assert.deepStrictEqual(getRenderedLabels(component), ["P10", "P2", "P1"]);
   });

   it("sorts by the displayed value when no sortField is set", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     field: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const component = await createTestRenderer(store, widget);

      await clickHeader(component, "Priority");
      assert.deepStrictEqual(getRenderedLabels(component), ["P1", "P10", "P2"]);
   });

   it("applies sortField precedence to sorters restored from sortField/sortDirection bindings", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               sortField={bind("sortField")}
               sortDirection={bind("sortDirection")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({
         data: { records, sortField: "priority", sortDirection: "ASC" },
      });
      const component = await createTestRenderer(store, widget);

      assert.deepStrictEqual(getRenderedLabels(component), ["P1", "P2", "P10"]);
   });

   it("marks only the clicked column as sorted", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
                  {
                     header: "Label",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const component = await createTestRenderer(store, widget);

      await clickHeader(component, "Priority");

      let ths = component.root.findAllByType("th");
      let sorted = ths.filter((th: any) => (th.props.className || "").includes("sorted-asc"));
      assert.strictEqual(sorted.length, 1);
      assert.strictEqual(thText(sorted[0]), "Priority");
   });
});
