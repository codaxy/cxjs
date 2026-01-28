import { Button, HtmlElement } from "cx/widgets";

export default (
   <cx>
      <div style="overflow-y: auto; height: 200px">
         <div style="overflow-y: auto;  height: 200px;">
            <div style="height: 400px; background: yellow" />
         </div>
         <div style="overflow-y: auto; height: 200px;" tabIndex="0">
            <div style="height: 400px;  background: orange; padding: 20px">
               <Button
                  onClick={() => {
                     alert("x");
                  }}
                  onMouseDown={(e) => {
                     e.preventDefault();
                  }}
               />
            </div>
         </div>
      </div>
   </cx>
);
