import { Button, Checkbox, HtmlElement, enableTooltips } from "cx/widgets";

enableTooltips();

export default (
   <cx>
      <div>
         <div tooltip="Nesto" style="display:inline-block">
            <Checkbox disabled>Checkbox</Checkbox>
         </div>
         <Button
            tooltip="Should disappear"
            disabled-bind="disabled"
            onClick={(e, { store }) => {
               store.toggle("disabled");
            }}
         >
            Click Me
      </Button>
      </div>
   </cx>
);
