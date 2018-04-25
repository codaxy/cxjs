import { Controller, LabelsLeftLayout, Repeater, UseParentLayout } from "cx/ui";
import { HtmlElement, Menu, Slider, Switch } from "cx/widgets";

class Ctrl extends Controller {
   onInit() {
      this.store.set("$page.layers", [
         {
            id: 1,
            name: "Test 1"
         },
         {
            id: 2,
            name: "Test 2"
         }
      ]);
   }
}

export default (
   <cx>
      <div controller={Ctrl}>
         <div layout={LabelsLeftLayout}>
            <Slider
               label="Opacity"
               value-bind="$page.layer.opacity"
               minValue={0}
               maxValue={1}
            />
            <Repeater records-bind="$page.layers" layout={UseParentLayout}>
               <Switch value-bind="$record.isSelected" label-bind="$record.name" />
            </Repeater>
         </div>

         <div layout={LabelsLeftLayout}>
            <Slider
               label="Opacity"
               value-bind="$page.layer.opacity"
               minValue={0}
               maxValue={1}
            />
            <Switch value-bind="$page.v0" label="Test 1" />
            <Switch value-bind="$page.v1" label="Test 2" />
         </div>

         <div>
            <Repeater records-bind="$page.layers" layout={LabelsLeftLayout}>
               <Switch value-bind="$record.isSelected" label-bind="$record.name" />
            </Repeater>
         </div>
      </div>
   </cx>
);
