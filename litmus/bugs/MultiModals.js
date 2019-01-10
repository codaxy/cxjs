import { Button, Window, Link } from "cx/widgets";
import { Controller } from "cx/ui";



export default (
   <cx>
      <div>
         <Window visible modal center title="Modal1" bodyStyle="padding: 50px">
            <Button onClick={(e, {store}) => { store.toggle('modal2')}}>Modal</Button>
            <Window visible-bind="modal2" modal center title="Modal2" bodyStyle="padding: 50px">
               Modal 2
            </Window>
         </Window>
      </div>
   </cx>
);
