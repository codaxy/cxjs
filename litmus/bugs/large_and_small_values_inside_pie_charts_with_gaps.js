import { PieChart, PieSlice } from "cx/charts";
import { Svg } from "cx/svg";
import { LabelsTopLayout, bind, tpl } from "cx/ui";
import { Checkbox, Slider } from "cx/widgets";

export default (
   <cx>
      <Svg style="width: 500px; height: 500px;">
         <PieChart gap={bind("gap")}>
            <PieSlice value={bind("value")} colorIndex={0} r={80} r0={bind("r0")} br={bind("br")} />
            <PieSlice value={1000} colorIndex={3} r={80} r0={bind("r0")} br={bind("br")} visible={true} />
            <PieSlice value={5000} colorIndex={8} r={80} r0={bind("r0")} br={bind("br")} />
         </PieChart>
      </Svg>
      <div style="padding: 50px">
         <LabelsTopLayout columns={2}>
            <Slider value={bind("value", 50)} help={tpl("{value:n;0}")} label="Value" />
            <Slider value={bind("br", 0)} help={tpl("{br:n;0}")} label="Radius" />
            <Slider value={bind("r0", 50)} help={tpl("{r0:n;0}")} label="R0" />
            <Slider value={bind("gap", 20)} help={tpl("{gap:n;0}")} label="Gap" />
         </LabelsTopLayout>
      </div>
   </cx>
);
