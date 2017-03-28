import {
   ColorPicker,
   ColorField,
   LookupField,
   Select,
   Radio,
   Checkbox,
   Switch,
   MonthField,
   MonthPicker,
   Calendar,
   DateField,
   NumberField,
   TextArea,
   TextField,
   HtmlElement,
   Section,
   FlexRow
} from 'cx/widgets';

import {LabelsLeftLayout} from 'cx/ui';

const options = [
   {id: 1, text: 'Option 1'},
   {id: 2, text: 'Option 2'},
   {id: 3, text: 'Option 3'},
   {id: 4, text: 'Option 4'},
   {id: 5, text: 'Option 5'},
   {id: 6, text: 'Option 6'},
   {id: 7, text: 'Option 7'},
   {id: 8, text: 'Option 8'},
];

export default <cx>
   <Section mod="card" title="Inputs" style="flex:1 0 auto">
      <div layout={{type: LabelsLeftLayout, mod: "stretch"}}>
         <TextField label="TextField" value:bind="text" />
         <TextArea label="TextArea" value:bind="text2" rows={5} style="width:100%" />
         <NumberField label="NumberField" value:bind="number" />
         <Checkbox label="Checkbox" value:bind="checked">Checkbox</Checkbox>
         <Radio label="Radio" value:bind="radio" option={1}>Option 1</Radio>
         <Radio value:bind="radio" option={2}>Option 2</Radio>
         <Switch
           label="Switch"
           on:bind="$page.check"
           text:expr="{$page.check} ? 'ON' : 'OFF'"
         />
      </div>
   </Section>

   <Section mod="card" title="Dropdowns" style="flex:1 0 auto">
      <div layout={LabelsLeftLayout}>
         <Select label="Select" value:bind="radio" style="width:100%">
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
         </Select>
         <LookupField label="LookupField" value:bind="radio"
            options={options}
            style="width:100%;"/>
         <LookupField label="LookupField (multiple)" multiple values:bind="options"
            options={options}
            style="width:100%;"/>
         <DateField label="DateField" value:bind="date" style="width:100%"/>
         <MonthField label="MonthField" range from:bind="dateFrom" to:bind="dateTo" style="width:100%"/>
         <ColorField label="ColorField" value:bind="color" style="width:100%;"/>
      </div>
   </Section>

   <Section mod="card" title="Calendar">
      <Calendar value:bind="date"/>
   </Section>

   <Section mod="card" title="ColorPicker">
      <ColorPicker value:bind="color"/>
   </Section>

   <Section mod="card" title="MonthPicker">
      <MonthPicker style={{ height: '25em', maxWidth: '100%' }} range from:bind="dateFrom" to:bind="dateTo"/>
   </Section>
</cx>
