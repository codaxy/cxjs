import { Repeater, Slider, NumberField } from "cx/widgets";

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
         <NumberField value-bind="num" reactOn="change" />
         <NumberField value-bind="num" reactOn="change" />
         <Repeater records-bind="arr">
            <div>
               <Slider to-bind="$record.value" wheel maxValue={100} step={1} />
            </div>
         </Repeater>
      </div>
   </cx>
);
