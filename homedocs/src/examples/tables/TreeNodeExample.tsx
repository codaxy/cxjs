import { createModel } from "cx/data";
import { Controller, expr, KeySelection, TreeAdapter } from "cx/ui";
import { Grid, TreeNode } from "cx/widgets";

import "../../icons/lucide";

// @model
interface TreeRecord {
  id: number;
  name: string;
  $leaf?: boolean;
  $expanded?: boolean;
  $level?: number;
  $children?: TreeRecord[];
}

interface PageModel {
  data: TreeRecord[];
  selection: number;
  $record: TreeRecord;
}

const m = createModel<PageModel>();
// @model-end

// @controller
function getFileIcon(name: string): string {
  if (name.endsWith(".tsx") || name.endsWith(".ts")) return "file-code";
  if (name.endsWith(".json")) return "file-json";
  if (name.endsWith(".md")) return "file-text";
  return "file";
}

class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(m.data, [
      {
        id: 1,
        name: "src",
        $leaf: false,
        $expanded: true,
        $children: [
          { id: 2, name: "index.tsx", $leaf: true },
          { id: 3, name: "App.tsx", $leaf: true },
          {
            id: 4,
            name: "components",
            $leaf: false,
            $children: [
              { id: 5, name: "Header.tsx", $leaf: true },
              { id: 6, name: "Footer.tsx", $leaf: true },
            ],
          },
        ],
      },
      { id: 7, name: "package.json", $leaf: true },
      { id: 8, name: "README.md", $leaf: true },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Grid
      records={m.data}
      mod="tree"
      style="height: 300px"
      scrollable
      dataAdapter={{ type: TreeAdapter }}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
      columns={[
        {
          header: "Name",
          field: "name",
          children: (
            <TreeNode
              expanded={m.$record.$expanded}
              leaf={m.$record.$leaf}
              level={m.$record.$level}
              text={m.$record.name}
              icon={expr(m.$record, (r) =>
                r.$leaf
                  ? getFileIcon(r.name)
                  : r.$expanded
                    ? "folder-open"
                    : "folder",
              )}
            />
          ),
        },
      ]}
    />
  </div>
);
// @index-end
