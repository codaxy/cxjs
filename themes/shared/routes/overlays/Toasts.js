import {HtmlElement} from 'cx/ui/HtmlElement';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Button} from 'cx/ui/Button';
import {Toast} from 'cx/ui/overlay/Toast';
import {FlexRow} from 'cx/ui/layout/FlexBox';

function addToast3(e, {store}) {
   let toast = Toast.create({
      message: 'This toast will disappear after 3 seconds.',
      timeout: 3001
   });
   toast.open(store);
}

function addToast5(e, {store}) {
   let toast = Toast.create({
      message: 'This toast will disappear after 5 seconds.',
      timeout: 5001
   });
   toast.open(store);
}

export default <cx>
   <FlexRow spacing align wrap>
      <Checkbox value:bind="$page.toast1">Toast1</Checkbox>
      <Checkbox value:bind="$page.toast2">Toast2</Checkbox>
      <Checkbox value:bind="$page.toast3">Toast3</Checkbox>
      <Button onClick={addToast3}>3s Toast</Button>
      <Button onClick={addToast5}>5s Toast</Button>

      <Toast visible:bind="$page.toast1" pad>
         <FlexRow spacing align="center">
            <span>Toast 1</span>
            <Button dismiss icon="close" mod="hollow" />
         </FlexRow>
      </Toast>
      <Toast visible:bind="$page.toast2" closable pad>
         <FlexRow spacing align="center">
            <Button dismiss icon="close" mod="hollow" />
            <span>Toast 2</span>
            <div>
               <Button dismiss icon="close" mod="hollow" />
               <Button dismiss icon="close" mod="hollow" />
            </div>
         </FlexRow>
      </Toast>
      <Toast visible:bind="$page.toast3" closable pad>
         <Checkbox value:bind="$page.toast3">Toast 3</Checkbox>
      </Toast>
   </FlexRow>
</cx>
