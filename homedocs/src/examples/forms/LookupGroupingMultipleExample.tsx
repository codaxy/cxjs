import { createModel } from "cx/data";
import { Controller, LabelsTopLayout } from "cx/ui";
import { LookupField } from "cx/widgets";

// @model
interface User {
  id: number;
  os: string;
  browser: string;
  fullName: string;
}

interface Model {
  user: number;
  userOptions: User[];
  $group: {
    os: string;
    browser: string;
  };
}

const m = createModel<Model>();
// @model-end

const browsers = ["Chrome", "Firefox", "Internet Explorer", "Opera", "Safari", "Edge"];
const operatingSystems = ["Windows", "Mac OS", "Ubuntu", "Android", "iOS"];
const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Ivan", "Julia"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Taylor"];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.userOptions,
      Array.from({ length: 50 }).map((_, i) => ({
        id: i + 1,
        os: operatingSystems[i % operatingSystems.length],
        browser: browsers[i % browsers.length],
        fullName: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / 10) % lastNames.length]}`,
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div layout={{ type: LabelsTopLayout, vertical: true }} controller={PageController}>
    <LookupField
      label="User"
      value={m.user}
      options={m.userOptions}
      optionTextField="fullName"
      listOptions={{
        grouping: [
          {
            key: {
              os: {
                value: { bind: "$option.os" },
                direction: "ASC",
              },
            },
            header: <div text={m.$group.os} class="font-bold p-2" />,
          },
          {
            key: {
              browser: {
                value: { bind: "$option.browser" },
                direction: "ASC",
              },
            },
            header: <div text={m.$group.browser} class="text-xs uppercase font-semibold text-gray-500 py-2 pl-6" />,
          },
        ],
        itemStyle: "padding-left: 40px;",
      }}
    />
  </div>
);
// @index-end
