import { Button, HtmlElement, Window } from "cx/widgets";

export default (
   <cx>
      <div>
         <Window
            visible-bind="showWindow"
            onKeyDown={(e, { dismiss }) => {
               console.log(String.fromCharCode(e.keyCode));
               //if (e.keyCode == 27) dismiss();
            }}
            bodyStyle="padding: 20px"
            closeOnEscape
         >
            <p>Press Esc to close me!</p>
         </Window>
         <Button
            onClick={(e, { store }) => {
               store.toggle("showWindow");
            }}
         >
            Show/Hide Window
         </Button>
      </div>
   </cx>
);
