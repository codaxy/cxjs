import {Grid, HtmlElement, Button, Submenu, Menu, Icon, Checkbox, TextField} from "cx/widgets";
import {Content, Controller, KeySelection, bind} from "cx/ui";

class PageController extends Controller {
   onDestroy() {
      alert('x');
   }
}


export default (
   <cx>
      <div style="padding: 20px">
         <div
            visible:bind="toggle"
            controller={PageController}
         >
            Controller
         </div>
         <Button onClick={(e, {store}) => {
            store.toggle('toggle');
         }}>
            Toggle
         </Button>
      </div>
   </cx>
);
