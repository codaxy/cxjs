import { createAccessorModelProxy } from "cx/data";
import { LabelsTopLayout, Rescope } from "cx/ui";
import { TextField } from "cx/widgets";

// @model
interface Manager {
  name: string;
  email: string;
}

interface Team {
  manager: Manager;
  size: number;
}

interface PageModel {
  company: {
    name: string;
    team: Team;
  };
}

const m = createAccessorModelProxy<PageModel>();

// Model for rescoped context (bound to company.team.manager)
const mManager = createAccessorModelProxy<Manager>();
// @model-end

// @controller
const controller = {
  onInit() {
    this.store.set(m.company, {
      name: "Acme Corp",
      team: {
        manager: {
          name: "John Doe",
          email: "john@acme.com",
        },
        size: 10,
      },
    });
  },
};
// @controller-end

// @index
export default () => (
  <div class="" controller={controller}>
    <div class="text-sm">Without Rescope (long paths):</div>
    <div class="flex gap-4" layout={LabelsTopLayout}>
      <TextField value={m.company.team.manager.name} label="Manager Name" />
      <TextField value={m.company.team.manager.email} label="Manager Email" />
    </div>

    <div class="text-sm mt-8">With Rescope (short paths):</div>
    <Rescope bind={m.company.team.manager}>
      <div class="flex gap-4" layout={LabelsTopLayout}>
        <TextField value={mManager.name} label="Manager Name" />
        <TextField value={mManager.email} label="Manager Email" />
      </div>
    </Rescope>
  </div>
);
// @index-end
