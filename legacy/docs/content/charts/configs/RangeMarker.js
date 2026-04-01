import { Md } from "docs/components/Md";

import classAndStyle from "../../widgets/configs/classAndStyle";

export default {
   ...classAndStyle,

   x: {
      key: true,
      type: "number",
      description: (
         <cx>
            <Md>The `x` value binding or expression.</Md>
         </cx>
      ),
   },

   y: {
      key: true,
      type: "number",
      description: (
         <cx>
            <Md>The `y` value binding or expression.</Md>
         </cx>
      ),
   },
   vertical: {
      key: true,
      type: "boolean",
      description: (
         <cx>
            <Md>Switch to vertical mode.</Md>
         </cx>
      ),
   },
   size: {
      key: true,
      type: "number",
      description: (
         <cx>
            <Md>Size of the range marker.</Md>
         </cx>
      ),
   },
   lineStyle: {
      type: "string/object",
      description: (
         <cx>
            <Md>Style object applied to the range marker.</Md>
         </cx>
      ),
   },
   lineClass: {
      type: "string/object",
      description: (
         <cx>
            <Md>Class object applied to the range marker.</Md>
         </cx>
      ),
   },
   capSize: {
      type: "number",
      description: (
         <cx>
            <Md>Size of vertical or horizontal caps. </Md>
         </cx>
      ),
   },
   shape: {
      key: true,
      type: "string",
      description: (
         <cx>
            <Md>The shape of marker, Could be `min`, `max`, `line`. Default to `line.`</Md>
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
   inflate: {
      type: "number",
      description: (
         <cx>
            <Md>Inflate the range marker.</Md>
         </cx>
      ),
   },
};
