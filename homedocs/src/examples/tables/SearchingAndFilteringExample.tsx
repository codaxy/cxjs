import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Grid, LookupField, TextField } from "cx/widgets";
import { getSearchQueryPredicate } from "cx/util";

import "../../icons/lucide";

// @model
interface Employee {
  id: number;
  fullName: string;
  phone: string;
  city: string;
}

interface PageModel {
  search: string;
  cityFilter: string;
  employees: Employee[];
  cities: { id: string; text: string }[];
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(m.employees, [
      { id: 1, fullName: "Alice Johnson", phone: "555-1234", city: "New York" },
      { id: 2, fullName: "Bob Smith", phone: "555-2345", city: "Los Angeles" },
      { id: 3, fullName: "Carol White", phone: "555-3456", city: "Chicago" },
      { id: 4, fullName: "David Brown", phone: "555-4567", city: "Houston" },
      { id: 5, fullName: "Eva Green", phone: "555-5678", city: "Phoenix" },
      { id: 6, fullName: "Frank Miller", phone: "555-6789", city: "New York" },
      { id: 7, fullName: "Grace Lee", phone: "555-7890", city: "Chicago" },
      { id: 8, fullName: "Henry Wilson", phone: "555-8901", city: "Los Angeles" },
    ]);
    this.store.set(m.cities, [
      { id: "New York", text: "New York" },
      { id: "Los Angeles", text: "Los Angeles" },
      { id: "Chicago", text: "Chicago" },
      { id: "Houston", text: "Houston" },
      { id: "Phoenix", text: "Phoenix" },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <div className="flex gap-4 mb-4">
      <TextField value={m.search} icon="search" placeholder="Search..." />
      <LookupField
        value={m.cityFilter}
        options={m.cities}
        placeholder="Filter by city..."
        style="width: 200px"
      />
    </div>
    <Grid
      records={m.employees}
      columns={[
        { header: "Name", field: "fullName", sortable: true },
        { header: "Phone", field: "phone" },
        { header: "City", field: "city", sortable: true },
      ]}
      style="height: 300px"
      scrollable
      emptyText="No records match the filter criteria"
      filterParams={{ search: m.search, city: m.cityFilter }}
      onCreateFilter={(params: { search: string; city: string }) => {
        let { search, city } = params || {};
        let predicate = search ? getSearchQueryPredicate(search) : null;
        return (record: Employee) => {
          if (city && record.city !== city) return false;
          if (predicate) {
            return (
              predicate(record.fullName) ||
              predicate(record.phone) ||
              predicate(record.city)
            );
          }
          return true;
        };
      }}
    />
  </div>
);
// @index-end
