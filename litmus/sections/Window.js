import { Grid, HtmlElement, MsgBox, Window, Button } from 'cx/widgets';

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
