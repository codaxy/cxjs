import { HtmlElement, Checkbox, Button, Toast, FlexRow } from 'cx/widgets';

function addToast3(e, {store}) {
   let toast = Toast.create({
      message: 'This is the default toast. It will disappear after 3 seconds.',
      timeout: 3001
   });
   toast.open(store);
}

function addToast5(e, {store}) {
   let toast = Toast.create({
      message: 'This toast has mod: "dark" set.',
      timeout: 5001,
      mod: "dark"
   });
   toast.open(store);
}

export default <cx>
   <FlexRow spacing align wrap>
      <Checkbox value:bind="$page.toast1">Closable Toast</Checkbox>
      <Checkbox value:bind="$page.toast2">Toast With Icon</Checkbox>
      <Checkbox value:bind="$page.toast3">Toast With Checkbox</Checkbox>
      <Button onClick={addToast3}>Default</Button>
      <Button onClick={addToast5}>Dark</Button>

      <Toast visible:bind="$page.toast1" pad>
         <FlexRow spacing align="center">
            <span>Toast 1</span>
            <Button dismiss icon="close" mod="hollow" />
         </FlexRow>
      </Toast>
      <Toast visible:bind="$page.toast2" closable pad>
         <FlexRow spacing align="center">
            <div>
               <i class="material-icons">person</i>
            </div> 
            <span>Toast 2</span>
            <Button dismiss icon="close" mod="hollow" />            
         </FlexRow>
      </Toast>
      <Toast visible:bind="$page.toast3" mod="contrast" closable pad>
         <Checkbox value:bind="$page.toast3">Toast 3</Checkbox>
      </Toast>
   </FlexRow>
</cx>
