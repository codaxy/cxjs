import { createModel, getComparer } from "cx/data";
import { Controller, Sorter } from "cx/ui";
import { Grid, Pagination, Select, TextField } from "cx/widgets";

// @model
interface Employee {
  id: number;
  fullName: string;
  phone: string;
  city: string;
}

interface Filter {
  name: string | null;
  phone: string | null;
  city: string | null;
}

interface PageModel {
  records: Employee[];
  page: number;
  pageSize: number;
  pageCount: number;
  sorters: Sorter[];
  filter: Filter;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  dataSet: Employee[] = [];

  onInit() {
    // Generate sample data
    this.dataSet = Array.from({ length: 200 }, (_, i) => ({
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
      city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][i % 5],
    }));

    this.store.init(m.pageSize, 10);
    this.store.init(m.filter, { name: null, phone: null, city: null });

    // Reset to page 1 when context changes
    this.addTrigger(
      "resetPage",
      [m.pageSize, m.sorters, m.filter],
      () => {
        this.store.set(m.page, 1);
      },
      true,
    );

    // Fetch data when pagination parameters change
    this.addTrigger(
      "fetchData",
      [m.pageSize, m.page, m.sorters, m.filter],
      (size, page, sorters, filter) => {
        // Simulate server-side filtering
        let filtered = this.dataSet;
        if (filter) {
          if (filter.name) {
            const checks = filter.name
              .split(" ")
              .map((w) => new RegExp(w, "gi"));
            filtered = filtered.filter((x) =>
              checks.every((ex) => x.fullName.match(ex)),
            );
          }
          if (filter.phone) {
            filtered = filtered.filter((x) => x.phone.includes(filter.phone!));
          }
          if (filter.city) {
            filtered = filtered.filter((x) =>
              x.city.toLowerCase().includes(filter.city!.toLowerCase()),
            );
          }
        }

        // Simulate server-side sorting
        if (sorters?.length) {
          const compare = getComparer(
            sorters.map((s) => ({
              value: { bind: s.field },
              direction: s.direction,
            })),
          );
          filtered = [...filtered].sort(compare);
        }

        // Simulate server-side pagination
        this.store.set(
          m.records,
          filtered.slice((page - 1) * size, page * size),
        );
        this.store.set(m.pageCount, Math.ceil(filtered.length / size));
      },
      true,
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Grid
      records={m.records}
      style="width: 100%"
      mod="bordered"
      lockColumnWidths
      sorters={m.sorters}
      remoteSort
      columns={[
        {
          field: "fullName",
          sortable: true,
          header1: "Name",
          header2: {
            allowSorting: false,
            style: "font-weight: 400; padding: 2px",
            children: (
              <TextField
                value={m.filter.name}
                reactOn="enter blur"
                style="width: 100%"
                placeholder="Filter..."
              />
            ),
          },
        },
        {
          field: "phone",
          header1: "Phone",
          header2: {
            style: "font-weight: 400; padding: 2px",
            children: (
              <TextField
                value={m.filter.phone}
                reactOn="enter blur"
                style="width: 100%"
                placeholder="Filter..."
              />
            ),
          },
        },
        {
          field: "city",
          sortable: true,
          header1: "City",
          header2: {
            allowSorting: false,
            style: "font-weight: 400; padding: 2px",
            children: (
              <TextField
                value={m.filter.city}
                reactOn="enter blur"
                style="width: 100%"
                placeholder="Filter..."
              />
            ),
          },
        },
      ]}
    />
    <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center">
      <Pagination page={m.page} pageCount={m.pageCount} />
      <Select value={m.pageSize}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </Select>
    </div>
  </div>
);
// @index-end
