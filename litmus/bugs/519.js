import {Sandbox, Tab, enableTooltips} from "cx/widgets";

enableTooltips();

export default <cx>
   <div>
      <Sandbox key-bind="key" storage-bind="pages">
         <Tab value-bind="key" tab="1" tooltip="Tab1">Tab1</Tab>
         <Tab value-bind="key" tab="2" tooltip="Tab2">Tab2</Tab>
         <Tab value-bind="key" tab="3" tooltip="Tab3">Tab3</Tab>
      </Sandbox>
   </div>
</cx>