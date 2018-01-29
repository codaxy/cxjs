import {Window, TextField, TextArea, DateField, Button} from "cx/widgets";
import {LabelsLeftLayout} from "cx/ui";

export default <cx>
   <Window
      title="Contact"
      center
      style={{width: '500px'}}
      modal
   >
      <div putInto="header">
         <Button
            text="Click Me"
            onClick={(e) => {
               alert("Clicked");
            }}
         />
      </div>
      <div style={{padding: "20px"}} layout={{type: LabelsLeftLayout, mod: 'stretch'}}>
         <TextField label="Name" value:bind="$page.contact.name" style={{width: '100%'}}/>
         <TextField label="Email" value:bind="$page.contact.email" style={{width: '100%'}}/>
         <TextArea label="Message" value:bind="$page.contact.message" rows={10} style={{width: '100%'}}/>
         <DateField label="Date" value:bind="$page.contact.date"/>
      </div>
      <div putInto="footer" style={{float: "right"}} trimWhitespace={false}>
         <Button mod="primary">Submit</Button>
         <Button dismiss>
            Cancel
         </Button>
      </div>
   </Window>
</cx>