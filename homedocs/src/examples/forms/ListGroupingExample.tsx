import { createModel } from "cx/data";
import { Controller, expr, KeySelection } from "cx/ui";
import { List } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  phone: string;
  city: string;
}

interface Model {
  records: Person[];
  selection: number;
  $record: Person;
  $group: {
    city: string;
    count: number;
  };
}

const m = createModel<Model>();
// @model-end

const contacts = [
  { fullName: "Alice Johnson", city: "New York" },
  { fullName: "Bob Smith", city: "Los Angeles" },
  { fullName: "Charlie Brown", city: "Chicago" },
  { fullName: "Diana Ross", city: "New York" },
  { fullName: "Edward Norton", city: "Los Angeles" },
  { fullName: "Fiona Apple", city: "Chicago" },
  { fullName: "George Lucas", city: "New York" },
  { fullName: "Hannah Montana", city: "Los Angeles" },
  { fullName: "Ivan Petrov", city: "Chicago" },
];

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.records,
      contacts.map((c, i) => ({
        id: i + 1,
        fullName: c.fullName,
        phone: `555-${String(1000 + i).padStart(4, "0")}`,
        city: c.city,
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <List
      records={m.records}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
      style="max-height: 400px"
      mod="bordered"
      recordAlias={m.$record}
      grouping={{
        key: {
          city: m.$record.city,
        },
        aggregates: {
          count: { type: "count", value: 1 },
        },
        header: (
          <div
            class="p-2 pt-4 pb-1 font-bold text-gray-500"
            text={m.$group.city}
          />
        ),
        footer: (
          <div class="text-sm text-gray-500 p-2 border-t border-gray-200">
            <span text={m.$group.count} /> contact(s)
          </div>
        ),
      }}
    >
      <div class="font-medium" text={m.$record.fullName} />
      <div class="text-sm text-gray-500">
        <span text={m.$record.phone} /> · <span text={m.$record.city} />
      </div>
    </List>
  </div>
);
// @index-end
