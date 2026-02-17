import { createModel } from "cx/data";
import { LabelsTopLayout, tpl } from "cx/ui";
import { Radio, Sandbox, TextField } from "cx/widgets";

// @model
interface Contestant {
  firstName: string;
  lastName: string;
}

interface PageModel {
  place: string;
  results: Record<string, Contestant>;
  $contestant: Contestant;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div>
    <div class="flex gap-4">
      <Radio value={m.place} option="winner" default>
        1st Place
      </Radio>
      <Radio value={m.place} option="second">
        2nd Place
      </Radio>
      <Radio value={m.place} option="third">
        3rd Place
      </Radio>
    </div>
    <Sandbox key={m.place} storage={m.results} recordAlias={m.$contestant}>
      <LabelsTopLayout>
        <TextField value={m.$contestant.firstName} label="First Name" />
        <TextField value={m.$contestant.lastName} label="Last Name" />
      </LabelsTopLayout>
    </Sandbox>
    <div class="mt-4 flex flex-col gap-2">
      <div class="font-medium leading-none">Results</div>
      <div
        class="text-sm"
        text={tpl(
          m.results.winner.firstName,
          m.results.winner.lastName,
          "1. {0} {1}",
        )}
      />
      <div
        class="text-sm"
        text={tpl(
          m.results.second.firstName,
          m.results.second.lastName,
          "2. {0} {1}",
        )}
      />
      <div
        class="text-sm"
        text={tpl(
          m.results.third.firstName,
          m.results.third.lastName,
          "3. {0} {1}",
        )}
      />
    </div>
  </div>
);
// @index-end
