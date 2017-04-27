import {TextField, DateField, NumberField, HtmlElement, FlexRow, IsolatedScope} from 'cx/widgets';
import {LabelsLeftLayout} from 'cx/ui';

const createBox = (index) => <cx>
   <IsolatedScope bind={`form${index}`}>
      <section>
         <h3 text={`Form${index}`}/>
         <div layout={LabelsLeftLayout}>
            <TextField label="TextField" value:bind={`form${index}.text`}/>
            <DateField label="DateField" value:bind={`form${index}.date`}/>
            <NumberField label="NumberField" value:bind={`form${index}.number`}/>
         </div>
      </section>
   </IsolatedScope>
</cx>

export default <cx>
   <FlexRow wrap>
      {Array.from({length: 100}, (_, i) => createBox(i))}
   </FlexRow>
</cx>;
