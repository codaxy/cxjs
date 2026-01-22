import { createModel } from "cx/data";
import { bind } from "cx/ui";
import { Button, HScroller, Tab } from "cx/widgets";

interface Model {
  tab: string;
}

const m = createModel<Model>();

// @model
export const model = {
  tab: "tab1",
};
// @model-end

// @index
export default (
  <div>
    <HScroller scrollIntoViewSelector=".cxb-tab.cxs-active">
      <Tab tab="tab1" value={bind(m.tab)}>
        Tab 1
      </Tab>
      <Tab tab="tab2" value={bind(m.tab)}>
        Tab 2
      </Tab>
      <Tab tab="tab3" value={bind(m.tab)}>
        Tab 3
      </Tab>
      <Tab tab="tab4" value={bind(m.tab)} disabled>
        Tab 4
      </Tab>
      <Tab tab="tab5" value={bind(m.tab)}>
        Tab 5
      </Tab>
      <Tab tab="tab6" value={bind(m.tab)}>
        Tab 6
      </Tab>
      <Tab tab="tab7" value={bind(m.tab)}>
        Tab 7
      </Tab>
      <Tab tab="tab8" value={bind(m.tab)} disabled>
        Tab 8
      </Tab>
      <Tab tab="tab9" value={bind(m.tab)}>
        Tab 9
      </Tab>
      <Tab tab="tab10" value={bind(m.tab)}>
        Tab 10
      </Tab>
      <Tab tab="tab11" value={bind(m.tab)}>
        Tab 11
      </Tab>
      <Tab tab="tab12" value={bind(m.tab)} disabled>
        Tab 12
      </Tab>
      <Tab tab="tab13" value={bind(m.tab)}>
        Tab 13
      </Tab>
      <Tab tab="tab14" value={bind(m.tab)}>
        Tab 14
      </Tab>
      <Tab tab="tab15" value={bind(m.tab)}>
        Tab 15
      </Tab>
      <Tab tab="tab16" value={bind(m.tab)} disabled>
        Tab 16
      </Tab>
    </HScroller>

    <div className="flex gap-2 mt-4">
      <Button
        onClick={(e, { store }) => {
          store.set(m.tab, "tab1");
        }}
      >
        Go to Tab 1
      </Button>
      <Button
        onClick={(e, { store }) => {
          store.set(m.tab, "tab15");
        }}
      >
        Go to Tab 15
      </Button>
    </div>
  </div>
);
// @index-end
