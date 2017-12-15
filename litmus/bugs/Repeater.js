import {Button, HtmlElement, NumberField, Repeater, Text, Link} from "cx/widgets";
import {Controller} from "cx/ui";
import {Debug} from "cx/util";

Debug.enable('should-update');

class Ctrl extends Controller {
   onInit() {
      this.store.init('data', [{
         id: 1,
         text: '3',
         items: [{
            id: 1,
            text: '31'
         }]
      }, {
         id: 2,
         text: '2',
         items: [{
            id: 1,
            text: '31'
         }]
      }, {
         id: 3,
         text: '1',
         items: [{
            id: 1,
            text: '31'
         }]
      }]);
   }
}

export default (
   <cx>
      <div controller={Ctrl}>
         <Repeater records:bind="data" keyField="id">
            <dt>
               <Text bind="$record.text" />
            </dt>
            <Repeater records:bind="$record.items">
               <dd>
                  <Text bind="$record.text" />
               </dd>
            </Repeater>
         </Repeater>
      </div>
   </cx>
);
