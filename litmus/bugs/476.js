import { Button, HtmlElement, Menu, Submenu } from "cx/widgets";
import { Controller, PureContainer } from "cx/ui";

class Controller1 extends Controller {
   test() {
      alert("test");
   }
}

class Controller2 extends Controller {
   test2() {
      alert("test");
   }
}

export default (
   <cx>
      <PureContainer controller={Controller1}>
         <PureContainer controller={Controller2}>
            <Button text="Test" onClick="test" />

            <Menu horizontal>
               <Submenu>
                  <Button text="advanced" />
                  <Menu putInto="dropdown" placement="bottom">
                     <Menu.Item text="menu test" onClick="test" autoClose />
                     <Menu.Item text="menu test2" onClick="test2" autoClose />
                  </Menu>
               </Submenu>
            </Menu>
         </PureContainer>
      </PureContainer>
   </cx>
);
