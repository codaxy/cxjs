import {Tab, Grid, Checkbox} from "cx/widgets";

export default <cx>
   <div>
      <Tab value-bind="tab" tab="tab0" default>Tab0</Tab>
      <Tab value-bind="tab" tab="tab1">Tab1</Tab>
      <Tab value-bind="tab" tab="tab2">Tab2</Tab>

      <div visible-expr="{tab}=='tab1'">
         <Checkbox visible={false} value-bind="X">Checkbox</Checkbox>
         Tab1
      </div>
      <div visible-expr="{tab}=='tab2'">
         <Grid
            records={[{a: 'A', b: 'B'}]}
            columns={[{field: 'a', header: 'A'}, {field: 'b', header: 'B'}]}
         />
      </div>
   </div>
</cx>