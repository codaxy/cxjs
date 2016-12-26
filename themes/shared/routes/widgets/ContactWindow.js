import {
   HtmlElement, Window, TextField, TextArea, Checkbox, Button, Section,
   FlexRow
} from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';

export default <cx>
   <Window
      visible={{
         bind: "$page.contact.visible",
         defaultValue: false
      }}
      style="width:600px"
      title="Contact"
      resizable
      backdrop
      center
      footer={
         <FlexRow>
            <div style="margin-left: auto" preserveWhitespace>
               <Button mod="primary">Send</Button>
               <Button dismiss>Cancel</Button>
            </div>
         </FlexRow>
      }
   >
      <Section layout={{ type: LabelsLeftLayout, mod: 'stretch' }}>
         <TextField label="Email" value:bind="$page.contact.email" required/>
         <TextField label="Name" value:bind="$page.contact.name" required/>
         <TextArea label="Message" value:bind="$page.contact.msg" required style="width:100%" rows={10}/>
      </Section>
   </Window>
</cx>
