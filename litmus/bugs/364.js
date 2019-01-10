//import { DateField, DateTimeField, HtmlElement } from "cx/widgets";

// export default (
//    <cx>
//       <div>
//          <DateField value:bind="$page.date1" />
//          <DateTimeField value:bind="$page.date2" visible={false} />
//       </div>
//    </cx>
// );

import { ContentResolver, Controller, Text, computable } from "cx/ui";
import { DateField, HtmlElement, Repeater, TextField, DateTimeField } from "cx/widgets";

class mController extends Controller {
   init() {
      super.init();
      this.store.delete("data");
      this.store.set("data", [
         { type: "date", value: "21/12/2018" },
         { type: "text", value: "Hello!" }
      ]);
   }

   onResolve(type) {
      switch (type) {
         case "date":
            return (
               <cx>
                  <DateField value:bind="$param.value" />
               </cx>
            );

         case "text":
            return (
               <cx>
                  <TextField value:bind="$param.value" />
               </cx>
            );
      }
   }
}

export default (
   <cx>
      <div controller={mController}>
         <Repeater records:bind="data" recordAlias="$param">
            <div>
               <Text value:bind="$param.value" />
               <ContentResolver
                  params={computable("$param.type", type => type)}
                  onResolve="onResolve"
               />
            </div>
         </Repeater>
      </div>
   </cx>
);
