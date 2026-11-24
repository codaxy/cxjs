import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { TreeAdapter } from "../../ui/adapter/TreeAdapter";
import { Grid, GridConfig } from "./Grid";
import { TreeNode } from "./TreeNode";
import { render, settle, RenderResult } from "../../util/test/render";

interface Node {
   id: number;
   name: string;
   $leaf?: boolean;
   $expanded?: boolean;
   $level?: number;
   $loading?: boolean;
   $children?: Node[];
}

interface Model {
   nodes: Node[];
   $record: Node;
}

const m = createModel<Model>();

function tree(): Node[] {
   return [
      {
         id: 1,
         name: "Documents",
         $leaf: false,
         $expanded: true,
         $children: [
            { id: 11, name: "Letter", $leaf: true },
            { id: 12, name: "Archive", $leaf: false, $children: [{ id: 121, name: "Old letter", $leaf: true }] },
         ],
      },
      { id: 2, name: "Pictures", $leaf: false, $children: [{ id: 21, name: "Photo", $leaf: true }] },
      { id: 3, name: "Notes", $leaf: true },
   ];
}

async function setup(nodes: Node[] = tree(), gridProps: Partial<GridConfig> = {}, adapter: any = {}) {
   let store = new Store({ data: { nodes } });
   let screen = await render(
      <cx>
         <Grid
            records={m.nodes}
            keyField="id"
            mod="tree"
            dataAdapter={{ type: TreeAdapter, ...adapter }}
            columns={[
               {
                  header: "Name",
                  field: "name",
                  sortable: true,
                  children: (
                     <TreeNode
                        expanded={m.$record.$expanded}
                        leaf={m.$record.$leaf}
                        level={m.$record.$level}
                        loading={m.$record.$loading}
                        text={m.$record.name}
                     />
                  ),
               },
            ]}
            {...gridProps}
         />
      </cx>,
      { store },
   );
   return { store, screen };
}

// One entry per row: the name indented by level, with "+" for collapsed and "-" for expanded folders
function describeTree(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("tbody.cxe-grid-data .cxb-treenode")).map((node) => {
      let level = Number(node.className.match(/cxs-level-(\d+)/)![1]);
      let marker = node.classList.contains("cxs-leaf") ? " " : node.classList.contains("cxs-expanded") ? "-" : "+";
      return "  ".repeat(level) + marker + " " + node.textContent;
   });
}

async function toggle(screen: RenderResult, name: string) {
   let node = Array.from(screen.container.querySelectorAll(".cxb-treenode")).find((n) => n.textContent == name);
   assert.ok(node, `${name} not found`);
   await settle(() => userEvent.click(node.querySelector(".cxe-treenode-handle")!));
}

describe("Grid tree", () => {
   it("shows the top-level nodes and the children of expanded nodes, folders first", async () => {
      let { screen } = await setup();

      assert.deepEqual(describeTree(screen), ["- Documents", "  + Archive", "    Letter", "+ Pictures", "  Notes"]);
   });

   it("shows folders without $leaf before the leaves (#1348)", async () => {
      let { screen } = await setup([
         { id: 1, name: "Notes", $leaf: true },
         { id: 2, name: "Pictures", $children: [] },
         { id: 3, name: "Letter", $leaf: true },
         { id: 4, name: "Documents", $leaf: false, $children: [] },
      ]);
      assert.deepEqual(describeTree(screen), ["+ Pictures", "+ Documents", "  Notes", "  Letter"]);

      // sorting orders the folders and the leaves separately
      await settle(() => userEvent.click(screen.getByText("Name", { exact: true })));
      assert.deepEqual(describeTree(screen), ["+ Documents", "+ Pictures", "  Letter", "  Notes"]);
   });

   it("keeps the order of folders and leaves with foldersFirst: false", async () => {
      let { screen } = await setup(
         [
            { id: 1, name: "Notes", $leaf: true },
            { id: 2, name: "Pictures", $children: [] },
         ],
         {},
         { foldersFirst: false },
      );
      assert.deepEqual(describeTree(screen), ["  Notes", "+ Pictures"]);
   });

   it("expands and collapses nodes with the handle and stores the state in the records", async () => {
      let { store, screen } = await setup();

      await toggle(screen, "Archive");
      assert.deepEqual(describeTree(screen), [
         "- Documents",
         "  - Archive",
         "      Old letter",
         "    Letter",
         "+ Pictures",
         "  Notes",
      ]);
      assert.equal(store.get(m.nodes)[0].$children![1].$expanded, true);

      await toggle(screen, "Documents");
      assert.deepEqual(describeTree(screen), ["+ Documents", "+ Pictures", "  Notes"]);
      assert.equal(store.get(m.nodes)[0].$expanded, false);

      // expanded children stay expanded when the parent is expanded again
      await toggle(screen, "Documents");
      assert.deepEqual(describeTree(screen).slice(0, 3), ["- Documents", "  - Archive", "      Old letter"]);
   });

   it("sorts the children of each node separately, keeping folders first", async () => {
      let { screen } = await setup();
      await toggle(screen, "Pictures");

      await settle(() => userEvent.click(screen.getByText("Name", { exact: true })));
      assert.deepEqual(describeTree(screen), [
         "- Documents",
         "  + Archive",
         "    Letter",
         "- Pictures",
         "    Photo",
         "  Notes",
      ]);

      await settle(() => userEvent.click(screen.getByText("Name", { exact: true })));
      assert.deepEqual(describeTree(screen), [
         "- Pictures",
         "    Photo",
         "- Documents",
         "  + Archive",
         "    Letter",
         "  Notes",
      ]);
   });

   it("loads the children of a node when it is expanded for the first time", async () => {
      let loaded: string[] = [];
      let resolve!: (children: Node[]) => void;
      let { screen } = await setup(
         [
            { id: 1, name: "Remote", $leaf: false },
            { id: 2, name: "Local", $leaf: true },
         ],
         {},
         {
            onLoad: (context: any, instance: any, node: Node) => {
               loaded.push(node.name);
               return new Promise<Node[]>((r) => (resolve = r));
            },
         },
      );

      await toggle(screen, "Remote");
      assert.deepEqual(loaded, ["Remote"]);
      let remote = screen.container.querySelector("tbody.cxe-grid-data .cxb-treenode")!;
      assert.ok(remote.classList.contains("cxs-loading"));

      await settle(() => resolve([{ id: 11, name: "Fetched", $leaf: true }]));
      await expect.poll(() => describeTree(screen)).toEqual(["- Remote", "    Fetched", "  Local"]);

      await toggle(screen, "Remote");
      await toggle(screen, "Remote");
      assert.deepEqual(describeTree(screen), ["- Remote", "    Fetched", "  Local"]);
      assert.deepEqual(loaded, ["Remote"]);
   });

   it("does not load a node again if loading returned no children", async () => {
      let loaded: string[] = [];
      let { store, screen } = await setup(
         [{ id: 1, name: "Empty", $leaf: false }],
         {},
         {
            onLoad: (context: any, instance: any, node: Node) => {
               loaded.push(node.name);
               return Promise.resolve(null);
            },
         },
      );

      await toggle(screen, "Empty");
      await expect.poll(() => store.get(m.nodes)[0].$loading).toBe(false);
      await toggle(screen, "Empty");
      await toggle(screen, "Empty");

      assert.deepEqual(loaded, ["Empty"]);
      assert.deepEqual(describeTree(screen), ["- Empty"]);
   });
});
