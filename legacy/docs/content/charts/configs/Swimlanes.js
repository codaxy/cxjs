import { Md } from "docs/components/Md";

import boundedObject from "../../svg/configs/BoundedObject";
import xyAxis from "./xyAxis";
import noChildren from "../../widgets/configs/noChildren";

export default {
   ...boundedObject,
   ...xyAxis,
   ...noChildren,
   axes: {
      key: true,
      type: "object",
      description: (
         <cx>
            <Md>Axis definition. Each key represent an axis, and each value hold axis configuration.</Md>
         </cx>
      ),
   },
   size: {
      key: true,
      type: "number",
      description: (
         <cx>
            <Md>Represents a swimlane size.</Md>
         </cx>
      ),
   },
   vertical: {
      key: true,
      type: "boolean",
      description: (
         <cx>
            <Md>Switch to vertical swimlanes.</Md>
         </cx>
      ),
   },
   step: {
      key: true,
      type: "number",
      description: (
         <cx>
            <Md>
               Represents a swimlane step. Define a step on which a swimlane will be rendered. (eg. step 2 will render
               every second swimlane in the chart.)
            </Md>
         </cx>
      ),
   },
   laneStyle: {
      type: "string/object",
      description: (
         <cx>
            <Md>Style object applied to the swimlanes. </Md>
         </cx>
      ),
   },
   laneOffset: {
      type: "number",
      description: (
         <cx>
            <Md>
               The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and
               readability.
            </Md>
         </cx>
      ),
   },
};
