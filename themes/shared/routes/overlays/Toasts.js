import {HtmlElement} from 'cx/ui/HtmlElement';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Toast} from 'shared/components/Toast';

export default <cx>
   <div>
      <Checkbox value:bind="$page.toast1">Toast1</Checkbox>
      <Checkbox value:bind="$page.toast2">Toast2</Checkbox>
      <Checkbox value:bind="$page.toast3">Toast3</Checkbox>

      <Toast visible:bind="$page.toast1">
         Toast 1
      </Toast>
      <Toast visible:bind="$page.toast2">
         Toast 2
      </Toast>
      <Toast visible:bind="$page.toast3">
         Toast 3
      </Toast>
   </div>
</cx>
