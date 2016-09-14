import {TextField} from 'cx/ui/form/TextField';
import {DateField} from 'cx/ui/form/DateField';
import {NumberField} from 'cx/ui/form/NumberField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {HtmlElement} from 'cx/ui/HtmlElement';

export const FormSection = <cx>
   <section>
      <h3>Form</h3>
      <div layout={LabelsLeftLayout}>
         <TextField label="TextField" value:bind="form.text" />
         <DateField label="DateField" value:bind="form.date" />
         <NumberField label="NumberField" value:bind="form.number" />
      </div>
   </section>
</cx>;
