import {
   ColorPicker,
   ColorField,
   LookupField,
   Select,
   Radio,
   Checkbox,
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
   <Section mod="well" title="Inputs" style="flex:1">
      <div layout={{type: LabelsLeftLayout, mod: "stretch"}}>
         <TextField label="TextField" value:bind="text"/>
         <TextArea label="TextArea" value:bind="text2" rows={5} style="width:100%"/>
         <NumberField label="NumberField" value:bind="number"/>
         <Checkbox label="Checkbox" value:bind="checked">Checkbox</Checkbox>
         <Radio label="Radio" value:bind="radio" option={1}>Option 1</Radio>
         <Radio value:bind="radio" option={2}>Option 2</Radio>
      </div>
   </Section>

   <Section mod="well" title="Dropdowns" style="flex:1">
      <div layout={LabelsLeftLayout}>
         <Select label="Select" value:bind="radio">
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
         </Select>
         <LookupField label="LookupField" value:bind="radio"
            options={options}/>
         <LookupField label="LookupField (multiple)" multiple values:bind="options"
            options={options}/>
         <DateField label="DateField" value:bind="date"/>
         <MonthField label="MonthField" range from:bind="dateFrom" to:bind="dateTo"/>
         <ColorField label="ColorField" value:bind="color"/>
      </div>
   </Section>

   <Section mod="well" title="Calendar">
      <Calendar value:bind="date"/>
   </Section>

   <Section mod="well" title="ColorPicker">
      <ColorPicker value:bind="color"/>
   </Section>

   <Section mod="well" title="MonthPicker">
      <MonthPicker range from:bind="dateFrom" to:bind="dateTo"/>
   </Section>
</cx>
