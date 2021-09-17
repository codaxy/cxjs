import { ContentPlaceholder, PureContainer } from "cx/ui";
import { HtmlElement, Menu, MenuItem } from "cx/widgets";

export default (
   <cx>
      <Menu horizontal overflow style="width: 300px">
         <MenuItem text="Item1" onClick={() => { }} />
         <MenuItem text="Item2" onClick={() => { }} />
         <MenuItem text="Item3" onClick={() => { }} />
         <ContentPlaceholder name="items" onClick={() => { }} />
      </Menu>

      <PureContainer putInto="items">
         <PureContainer>
            <MenuItem text="Item1" onClick={() => { }} />
            <MenuItem text="Item2" onClick={() => { }} />
            <MenuItem text="Item3" onClick={() => { }} />
         </PureContainer>
      </PureContainer>
   </cx>
);
