import {
   HtmlElement, Window, TextField, TextArea, Checkbox, Button, Section,
   FlexRow, FlexCol
} from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';

export default <cx>
   <Window
      visible={{
         bind: "$page.contact.visible",
         defaultValue: false
      }}
      style="width:500px;max-width:100%"
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
      <Section>
         <FlexCol>
            <TextField label="Email" value:bind="$page.contact.email" required style="width: 80%"/>
            <TextField label="Name" value:bind="$page.contact.name" required style="width: 80%"/>
            <TextArea label="Message" value:bind="$page.contact.msg" required style="width:100%" rows={6}/>
         </FlexCol>
      </Section>
   </Window>
</cx>
