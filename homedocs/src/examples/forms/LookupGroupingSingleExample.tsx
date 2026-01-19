import { createModel } from "cx/data";
import {
  Controller,
  equal,
  FirstVisibleChildLayout,
  LabelsTopLayout,
  tpl,
  truthy,
} from "cx/ui";
import { Icon, LookupField, PureContainer } from "cx/widgets";
import "../../icons/lucide";

// @model
interface Browser {
  id: string;
  text: string;
  favorite: boolean;
}

interface Model {
  browser: string;
  browserOptions: Browser[];
  $group: {
    group: string;
    count: number;
  };
}

const m = createModel<Model>();

const browsers = [
  "Chrome",
  "Firefox",
  "Internet Explorer",
  "Opera",
  "Safari",
  "Edge",
];

// @model-end

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.browserOptions,
      browsers.map((b) => ({
        id: b,
        text: b,
        favorite: b == "Chrome",
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <LabelsTopLayout controller={PageController}>
    <LookupField
      label="Browser"
      value={m.browser}
      options={m.browserOptions}
      listOptions={{
        grouping: {
          key: {
            group: {
              value: { expr: "{$option.favorite} ? 'Favorites' : 'Other'" },
              direction: "ASC",
            },
          },
          header: (
            <FirstVisibleChildLayout>
              <div class="flex items-center gap-1.5 text-xs uppercase font-semibold text-gray-500 p-2">
                <Icon
                  name="star"
                  visible={equal(m.$group.group, "Favorites")}
                />
                <div text={m.$group.group} />
              </div>
            </FirstVisibleChildLayout>
          ),
        },
        itemStyle: "padding-left: 24px;",
      }}
    />
  </LabelsTopLayout>
);
// @index-end
