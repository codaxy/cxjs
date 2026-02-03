import { createModel } from "cx/data";
import { Tab } from "cx/widgets";

// @model
interface PageModel {
  tab: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div className="flex flex-col items-start gap-4">
    <div>
      <Tab tab="tab1" value={m.tab} default>
        Tab 1
      </Tab>
      <Tab tab="tab2" value={m.tab}>
        Tab 2
      </Tab>
      <Tab tab="tab3" value={m.tab}>
        Tab 3
      </Tab>
      <Tab tab="tab4" value={m.tab} disabled>
        Disabled
      </Tab>
    </div>
    <div>
      <Tab tab="tab1" value={m.tab} mod="line">
        Tab 1
      </Tab>
      <Tab tab="tab2" value={m.tab} mod="line">
        Tab 2
      </Tab>
      <Tab tab="tab3" value={m.tab} mod="line">
        Tab 3
      </Tab>
      <Tab tab="tab4" value={m.tab} mod="line" disabled>
        Disabled
      </Tab>
    </div>
    <div>
      <div className="pl-2">
        <Tab tab="tab1" value={m.tab} mod="classic">
          Tab 1
        </Tab>
        <Tab tab="tab2" value={m.tab} mod="classic">
          Tab 2
        </Tab>
        <Tab tab="tab3" value={m.tab} mod="classic">
          Tab 3
        </Tab>
        <Tab tab="tab4" value={m.tab} mod="classic" disabled>
          Disabled
        </Tab>
      </div>
      <div className="border border-border bg-white p-4" text={m.tab} />
    </div>
  </div>
);
// @index-end
