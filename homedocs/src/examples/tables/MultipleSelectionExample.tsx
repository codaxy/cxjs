import { createModel, updateArray } from "cx/data";
import { Controller, PropertySelection } from "cx/ui";
import { getSearchQueryPredicate } from "cx/util";
import { Checkbox, Grid, TextField } from "cx/widgets";

import "../../icons/lucide";

// @model
interface Employee {
  id: number;
  fullName: string;
  phone: string;
  city: string;
  selected: boolean;
}

interface PageModel {
  records: Employee[];
  searchText: string;
  selectAll: boolean | null;
  $record: Employee;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  visibleIdsMap: Record<number, boolean> = {};

  onInit() {
    this.store.set(
      m.records,
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        fullName:
          [
            "Alice Johnson",
            "Bob Smith",
            "Carol White",
            "David Brown",
            "Eva Green",
          ][i % 5] +
          " " +
          (i + 1),
        phone: `555-${String(1000 + i).padStart(4, "0")}`,
        city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
          i % 5
        ],
        selected: false,
      })),
    );

    // Handle "select all" checkbox clicks
    this.addTrigger("select-all-click", [m.selectAll], (value) => {
      if (value != null) {
        this.store.update(
          m.records,
          updateArray,
          (r: Employee) => ({ ...r, selected: value }),
          (r: Employee) => this.visibleIdsMap[r.id],
        );
      }
    });
  }

  // Track visible records and update "select all" state
  updateSelection(newRecords: { data: Employee }[]) {
    this.visibleIdsMap = newRecords.reduce(
      (acc, r) => {
        acc[r.data.id] = true;
        return acc;
      },
      {} as Record<number, boolean>,
    );

    let anySelected = false;
    let anyUnselected = false;

    for (const rec of newRecords) {
      if (rec.data.selected) anySelected = true;
      else anyUnselected = true;
      if (anySelected && anyUnselected) break;
    }

    // null = indeterminate, true = all selected, false = none selected
    this.store.set(
      m.selectAll,
      anySelected && anyUnselected ? null : !!anySelected,
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <TextField
      value={m.searchText}
      icon="search"
      placeholder="Search..."
      showClear
      style="width: 300px; margin-bottom: 16px"
    />
    <Grid
      records={m.records}
      style="width: 100%"
      filterParams={m.searchText}
      onCreateFilter={(searchText: string) => {
        if (!searchText) return () => true;
        const predicate = getSearchQueryPredicate(searchText);
        return (record: Employee) =>
          predicate(record.fullName) ||
          predicate(record.phone) ||
          predicate(record.city);
      }}
      onTrackMappedRecords={(records, instance) =>
        instance.getControllerByType(PageController).updateSelection(records)
      }
      selection={{ type: PropertySelection, multiple: true }}
      columns={[
        {
          header: {
            style: "padding: 2px",
            children: (
              <Checkbox
                value={m.selectAll}
                indeterminate
                unfocusable
                class="ml-4"
              />
            ),
          },
          field: "selected",
          style: "width: 1px",
          pad: false,
          align: "center",
          children: (
            <Checkbox value={m.$record.selected} unfocusable class="ml-4" />
          ),
        },
        { header: "Name", field: "fullName", sortable: true },
        { header: "Phone", field: "phone" },
        { header: "City", field: "city", sortable: true },
      ]}
    />
  </div>
);
// @index-end
