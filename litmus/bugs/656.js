import { LabelsLeftLayout } from "cx/ui";
import { Switch, TextField } from "cx/widgets";

export default (
   <cx>
      <div>
         <LabelsLeftLayout>
            <div visible-expr="{test.length} > 5">Test</div>
            <TextField value-bind="test" label="Test" />
         </LabelsLeftLayout>
      </div>
   </cx>
);
