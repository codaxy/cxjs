import {Grid} from 'cx/ui/grid/Grid';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {MsgBox} from 'cx/ui/overlay/MsgBox';
import {Window} from 'cx/ui/overlay/Window';
import {Button} from 'cx/ui/Button';

function msgAlert() {
   MsgBox.alert('Test');
}

export const WindowSection = <cx>
   <section>
      <h3>Windows</h3>

      <Button onClick={msgAlert}>Alert</Button>

      <Window visible:bind="windows.visible" title="test">
         <div style="padding:100px">
            Hello
         </div>
      </Window>

   </section>
</cx>;
