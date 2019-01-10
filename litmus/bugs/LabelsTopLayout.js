import {HtmlElement, TextField} from "cx/widgets";
import {LabelsTopLayout, LabelsLeftLayout, Rescope} from "cx/ui";

let Field = props => (
   <cx>
      <Rescope bind="x" useParentLayout>
         <TextField {...props} />
      </Rescope>
   </cx>
);

export default (
   <cx>
      <div ws>
         <h3>Home</h3>
         <LabelsTopLayout columns={2}>
            <Field label="Test"/>
         </LabelsTopLayout>
      </div>
   </cx>
);


{/*<TextField label="Test"/>*/}
{/*21312313*/}
{/*<TextField label="Test"/>*/}
   {/*<TextField label="Test"/>*/}