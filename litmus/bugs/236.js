import { Controller, Repeater, Text, bind } from "cx/ui";
import { Line, Rectangle, Svg } from "cx/svg";
import { ColorMap, Pie, PieChart, PieSlice } from "cx/charts";
import { HtmlElement } from "cx/widgets";

export default (
   <cx>
      <div>
         <div>
            <Svg style="width:600px; height:400px;">
               <ColorMap />
               <PieChart>
                  <Repeater
                     records={[ { id: 1, name: "Item 1", amount: 3000 } ]}
                     idField="id"
                  >
                     <PieSlice
                        colorMap="pie"
                        value={bind("$record.amount")}
                        r={90}
                        r0={30}
                        offset={4}
                        name={bind("$record.name")}
                     />
                  </Repeater>
               </PieChart>
            </Svg>
         </div>
         <div>
            <Svg style="width:600px; height:400px;">
               <ColorMap />
               <PieChart>
                  <Repeater
                     records={[ { id: 1, name: "Item 1", amount: 3001 } ]}
                     idField="id"
                  >
                     <PieSlice
                        colorMap="pie"
                        value={bind("$record.amount")}
                        r={90}
                        r0={30}
                        offset={4}
                        name={bind("$record.name")}
                     />
                  </Repeater>
               </PieChart>
            </Svg>
         </div>
      </div>
   </cx>
);
