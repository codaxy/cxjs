import { createModel } from "cx/data";
import { equal } from "cx/ui";
import { Tab } from "cx/widgets";

// @model
interface PageModel {
  tab: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div>
    <div className="pl-2">
      <Tab tab="tab1" value={m.tab} mod="classic" default>
        Profile
      </Tab>
      <Tab tab="tab2" value={m.tab} mod="classic">
        Settings
      </Tab>
      <Tab tab="tab3" value={m.tab} mod="classic">
        Notifications
      </Tab>
    </div>
    <div className="border cxm-cover p-4">
      <div visible={equal(m.tab, "tab1")}>Profile content goes here.</div>
      <div visible={equal(m.tab, "tab2")}>Settings content goes here.</div>
      <div visible={equal(m.tab, "tab3")}>Notifications content goes here.</div>
    </div>
  </div>
);
// @index-end
