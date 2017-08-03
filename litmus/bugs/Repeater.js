import {Button, HtmlElement, NumberField, Repeater} from "cx/widgets";
import {Controller} from "cx/ui";
import {Debug} from "cx/util";

Debug.enable('should-update');

class Ctrl extends Controller {
   onInit() {
      this.store.init('data', [{
      //    id: 1,
      //    text: '3'
      // }, {
      //    id: 2,
      //    text: '2'
      // }, {
         id: 3,
         text: '1'
      }]);
   }

   onButtonClick() {
      this.store.update('data', data => [
         {
            id: Math.random().toFixed(8),
            text: (data.length+1).toString()
         },
         ...data
      ])
   }
}

export default (
   <cx>
      <div controller={Ctrl}>
         <Repeater records:bind="data" keyField="id">
            <li>
               <NumberField value:bind="$record.value" label:bind="$record.text"/>
            </li>
         </Repeater>
         <Button onClick="onButtonClick">Click me</Button>
      </div>
   </cx>
);
