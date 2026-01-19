import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Checkbox, Grid, TextField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  phone: string;
  city: string;
  notified: boolean;
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
      {
        id: 1,
        fullName: "Alice Johnson",
        phone: "555-0101",
        city: "New York",
        notified: true,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        phone: "555-0102",
        city: "Los Angeles",
        notified: false,
      },
      {
        id: 3,
        fullName: "Carol White",
        phone: "555-0103",
        city: "Chicago",
        notified: true,
      },
      {
        id: 4,
        fullName: "David Brown",
        phone: "555-0104",
        city: "Houston",
        notified: false,
      },
      {
        id: 5,
        fullName: "Eva Green",
        phone: "555-0105",
        city: "Phoenix",
        notified: true,
      },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <Grid
    controller={PageController}
    records={m.records}
    columns={[
      {
        header: "Name",
        field: "fullName",
        sortable: true,
        children: <TextField value={m.$record.fullName} style="width: 100%" />,
        pad: false,
        class: "p-1!",
      },
      {
        header: "Phone",
        field: "phone",
        children: <TextField value={m.$record.phone} style="width: 100%" />,
        pad: false,
        class: "p-1!",
      },
      {
        header: "City",
        field: "city",
        sortable: true,
        children: <TextField value={m.$record.city} style="width: 100%" />,
        pad: false,
        class: "p-1!",
      },
      {
        header: "Notified",
        field: "notified",
        sortable: true,
        align: "center",
        pad: false,
        children: <Checkbox value={m.$record.notified} />,
        class: "p-1!",
      },
    ]}
    recordAlias={m.$record}
  />
);
// @index-end
