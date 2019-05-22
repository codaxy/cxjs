import {
   Button,
   Checkbox,
   DateField,
   FlexRow,
   HtmlElement,
   Menu,
   MenuItem,
   Submenu,
   TextField
} from "cx/widgets";

export default (
   <cx>
      <div class="widgets">
         <Menu horizontal>
            <Submenu>
               File
               <Menu putInto="dropdown">
                  <div style="margin: 5px;">
                     <FlexRow>
                        <Button text="B1" />
                        <Button text="B2" />
                        <Button text="B3" />
                     </FlexRow>
                  </div>
               </Menu>
            </Submenu>
         </Menu>
      </div>
   </cx>
);
