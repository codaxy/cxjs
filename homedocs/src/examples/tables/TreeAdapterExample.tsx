import { createModel } from "cx/data";
import { Controller, KeySelection, TreeAdapter } from "cx/ui";
import { Grid, TreeNode } from "cx/widgets";

import "../../icons/lucide";

// @model
interface TreeRecord {
  id: number;
  name: string;
  $leaf?: boolean;
  $expanded?: boolean;
  $level?: number;
  $loading?: boolean;
  entries?: TreeRecord[];
}

interface PageModel {
  data: TreeRecord[];
  selection: number;
  $record: TreeRecord;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.data, [
      {
        id: 1,
        name: "Documents",
        $leaf: false,
        $expanded: true,
        entries: [
          { id: 2, name: "report.pdf", $leaf: true },
          { id: 3, name: "notes.txt", $leaf: true },
        ],
      },
      {
        id: 4,
        name: "Images",
        $leaf: false,
        entries: [
          { id: 5, name: "photo.jpg", $leaf: true },
          { id: 6, name: "logo.png", $leaf: true },
        ],
      },
      { id: 7, name: "readme.md", $leaf: true },
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
      dataAdapter={{ type: TreeAdapter, childrenField: "entries" }}
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
            />
          ),
        },
      ]}
    />
  </div>
);
// @index-end
