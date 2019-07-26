import {TextField, TextArea, LabeledContainer, Radio} from "cx/widgets";
import {LabelsTopLayout, LabelsTopLayoutCell} from "cx/ui";

export default <cx>
   <LabelsTopLayout columns={2} mod="fixed" style="width: 300px">
      <TextField label="Field1" value-bind="$page.field1" style="width: 100%"/>
      <LabelsTopLayoutCell rowSpan={2} style="padding-left: 16px">
         <LabeledContainer label="Field2">
            <Radio value-bind="$page.field2" option={1}>Option 1</Radio>
            <Radio value-bind="$page.field2" option={2}>Option 2</Radio>
            <Radio value-bind="$page.field2" option={3}>Option 3</Radio>
         </LabeledContainer>
      </LabelsTopLayoutCell>
      <TextField label="Field3" value-bind="$page.field3" style="width: 100%"/>
      <LabelsTopLayoutCell colSpan={2}>
         <TextArea label="Field4" value-bind="$page.field8" style="width: 100%" rows={5}/>
      </LabelsTopLayoutCell>
      <TextField label="Field5" value-bind="$page.field5" style="width: 100%"/>
      <TextField label="Field6" value-bind="$page.field6" style="width: 100%"/>
   </LabelsTopLayout>
</cx>