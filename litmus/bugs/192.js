import { Button, HtmlElement, Link } from "cx/widgets";
import { Controller } from "cx/ui";

class Ctrl extends Controller {
   onLinkClick() {
      alert("Link Click");
   }

   onButtonClick() {
      alert("Button Click");
   }
}

export default (
   <cx>
      <div controller={Ctrl}>
         <Link href="#" onClick="onLinkClick">
            Click me
         </Link>
         <br />
         <Button onClick="onButtonClick">Click me</Button>
      </div>
   </cx>
);
