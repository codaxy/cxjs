import {TextField, DateField, NumberField, HtmlElement, Button, FlexRow, IsolatedScope, DetachedScope} from 'cx/widgets';
import {LabelsLeftLayout, Controller} from 'cx/ui';

class XController extends Controller {
   click() {
      alert('x');
   }
}

const createBox = (index) => <cx>
   <DetachedScope bind={[`form${index}`, "shared"]} exclusive={[`form${index}`]}>
      <section>
         <h3 text={`Form${index}`}/>
         <div layout={LabelsLeftLayout}>
            <TextField label="TextField" value:bind={`form${index}.text`}/>
            <DateField label="DateField" value:bind={`form${index}.date`}/>
            <NumberField label="NumberField" value:bind={`form${index}.number`}/>
            <TextField label="Shared" value:bind={`shared.text`}/>
            <Button onClick="click">Click</Button>
         </div>
      </section>
   </DetachedScope>
</cx>

export default <cx>
   <FlexRow wrap controller={XController}>
      {Array.from({length: 100}, (_, i) => createBox(i % 10))}
   </FlexRow>
</cx>;
