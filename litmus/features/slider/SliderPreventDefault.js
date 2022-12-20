import { Slider } from "cx/widgets";

export default (
   <cx>
      <div style="height: 2000px">
         <Slider to-bind="test" wheel maxValue={100} step={1} />
      </div>
   </cx>
);
