import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
}

interface PageModel {
  records: Person[];
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      { id: 1, fullName: "Alice Johnson", phone: "555-1001", email: "alice@example.com", city: "New York", country: "USA" },
      { id: 2, fullName: "Bob Smith", phone: "555-1002", email: "bob@example.com", city: "Los Angeles", country: "USA" },
      { id: 3, fullName: "Carol White", phone: "555-1003", email: "carol@example.com", city: "Chicago", country: "Canada" },
      { id: 4, fullName: "David Brown", phone: "555-1004", email: "david@example.com", city: "Houston", country: "Mexico" },
      { id: 5, fullName: "Eva Green", phone: "555-1005", email: "eva@example.com", city: "Phoenix", country: "USA" },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <Grid
    controller={PageController}
    records={m.records}
    style="width: 100%"
    border
    vlines
    columns={[
      {
        header1: { text: "Name", rowSpan: 2 },
        field: "fullName",
        sortable: true,
      },
      {
        align: "center",
        header1: { text: "Contact", colSpan: 2 },
        header2: "Phone",
        field: "phone",
      },
      {
        header2: "Email",
        field: "email",
        sortable: true,
      },
      {
        header1: { text: "Address", colSpan: 2, align: "center" },
        header2: "City",
        field: "city",
        sortable: true,
      },
      {
        header2: "Country",
        field: "country",
        sortable: true,
      },
    ]}
  />
);
// @index-end
