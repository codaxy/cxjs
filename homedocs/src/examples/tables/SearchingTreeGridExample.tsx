import { createModel, findTreeNode } from "cx/data";
import { Controller, TreeAdapter } from "cx/ui";
import { Grid, TextField, TreeNode } from "cx/widgets";

import "../../icons/lucide";

// @model
interface TreeRecord {
  id: number;
  name: string;
  city: string;
  $leaf?: boolean;
  $expanded?: boolean;
  $level?: number;
  $children?: TreeRecord[];
}

interface PageModel {
  search: string;
  data: TreeRecord[];
  $record: TreeRecord;
}

const m = createModel<PageModel>();
// @model-end

function isMatch(node: TreeRecord, search: string) {
  return (
    node.name.toLowerCase().includes(search) ||
    node.city.toLowerCase().includes(search)
  );
}

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(m.data, [
      {
        id: 1,
        name: "North America",
        city: "",
        $leaf: false,
        $expanded: true,
        $children: [
          { id: 2, name: "Alice Johnson", city: "New York", $leaf: true },
          { id: 3, name: "Bob Smith", city: "Los Angeles", $leaf: true },
          {
            id: 4,
            name: "West Coast",
            city: "",
            $leaf: false,
            $expanded: true,
            $children: [
              { id: 5, name: "Carol White", city: "Seattle", $leaf: true },
              { id: 6, name: "David Brown", city: "Portland", $leaf: true },
            ],
          },
        ],
      },
      {
        id: 7,
        name: "Europe",
        city: "",
        $leaf: false,
        $expanded: true,
        $children: [
          { id: 8, name: "Eva Green", city: "London", $leaf: true },
          { id: 9, name: "Frank Miller", city: "Paris", $leaf: true },
        ],
      },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <TextField
      value={m.search}
      icon="search"
      placeholder="Search..."
      style="margin-bottom: 16px"
    />
    <Grid
      records={m.data}
      mod="tree"
      style="height: 350px"
      scrollable
      dataAdapter={{ type: TreeAdapter }}
      emptyText="No records match the search"
      filterParams={m.search}
      onCreateFilter={(search: string) => {
        if (!search) return () => true;
        search = search.toLowerCase();
        return (node: TreeRecord) => {
          if (isMatch(node, search)) return true;
          if (node.$leaf || !node.$children) return false;
          const result = findTreeNode(
            node.$children,
            (subNode: TreeRecord) => isMatch(subNode, search),
            "$children",
          );
          return result ? true : false;
        };
      }}
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
        { header: "City", field: "city" },
      ]}
    />
  </div>
);
// @index-end
