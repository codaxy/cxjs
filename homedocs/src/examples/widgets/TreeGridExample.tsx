/** @jsxImportSource cx */
import { Grid, TreeNode } from "cx/widgets";
import { Controller, KeySelection, TreeAdapter } from "cx/ui";
import { $page, $record } from "../stores.js";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      {
        id: 1,
        name: "Documents",
        $expanded: true,
        $children: [
          { id: 2, name: "Work", $leaf: true },
          { id: 3, name: "Personal", $leaf: true },
        ],
      },
      {
        id: 4,
        name: "Photos",
        $expanded: false,
        $children: [
          { id: 5, name: "Vacation", $leaf: true },
          { id: 6, name: "Family", $leaf: true },
        ],
      },
      { id: 7, name: "README.md", $leaf: true },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Grid
        records={$page.data}
        mod="tree"
        style={{ width: "100%" }}
        dataAdapter={{ type: TreeAdapter }}
        selection={{ type: KeySelection, bind: $page.selection }}
        columns={[
          {
            header: "Name",
            field: "name",
            items: (
              <cx>
                <TreeNode
                  expanded={$record.$expanded}
                  leaf={$record.$leaf}
                  level={$record.$level}
                  text={$record.name}
                />
              </cx>
            ),
          },
        ]}
      />
    </div>
  </cx>
);
