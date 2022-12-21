import { Repeater, Slider } from "cx/widgets";

export default (
   <cx>
      <div
         style="height: 2000px"
         controller={{
            onInit() {
               this.store.set("arr", [{}, {}, {}]);
            },
         }}
      >
         <Repeater records-bind="arr">
            <div>
               <Slider to-bind="$record.value" wheel maxValue={100} step={1} />
            </div>
         </Repeater>
      </div>
   </cx>
);
