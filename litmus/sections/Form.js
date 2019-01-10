import { TextField, DateField, NumberField, HtmlElement } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';

export const FormSection = <cx>
   <section>
      <h3>Form</h3>
      <div layout={LabelsLeftLayout}>
         <TextField label="TextField" value:bind="form.text" tooltip="Tooltip" />
         <DateField label="DateField" value:bind="form.date" />
         <NumberField label="NumberField" value:bind="form.number" />
      </div>
   </section>
</cx>;
