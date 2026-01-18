import { createModel } from "cx/data";
import { Controller, KeySelection, TreeAdapter } from "cx/ui";
import { Grid, TreeNode } from "cx/widgets";

import "../../icons/lucide";

// @model
interface TreeRecord {
  id: number;
  name: string;
  phone: string;
  city: string;
  $leaf?: boolean;
  $expanded?: boolean;
  $level?: number;
  $loading?: boolean;
}

interface PageModel {
  data: TreeRecord[];
  selection: Record<number, boolean>;
  $record: TreeRecord;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  idSeq = 0;

  onInit() {
    this.store.set(m.data, this.generateRecords());
  }

  generateRecords(node?: TreeRecord): TreeRecord[] | undefined {
    if (!node || (node.$level ?? 0) < 3) {
      const names = [
        "Alice Johnson",
        "Bob Smith",
        "Carol White",
        "David Brown",
        "Eva Green",
      ];
      const cities = [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
      ];
      return Array.from({ length: 5 }, (_, i) => ({
        id: ++this.idSeq,
        name: names[i % 5],
        phone: `555-${String(1000 + this.idSeq).slice(-4)}`,
        city: cities[i % 5],
        $leaf: Math.random() > 0.5,
      }));
    }
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Grid
      records={m.data}
      mod="tree"
      style="height: 400px"
      scrollable
      dataAdapter={{
        type: TreeAdapter,
        onLoad: (context, instance, node) =>
          instance.getControllerByType(PageController).generateRecords(node),
      }}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
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
        { header: "Phone", field: "phone" },
        { header: "City", field: "city", sortable: true },
      ]}
    />
  </div>
);
// @index-end
