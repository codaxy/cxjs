import {FirstVisibleChildLayout, Restate} from "cx/ui";
import {Button} from "cx/widgets";

export default <cx>
   <div>
      Content Before
      <Restate
         detached
         onError={(error, instance, info) => {
            let {store} = instance;
            store.set("error", error);
         }}
         layout={FirstVisibleChildLayout}
      >
         <div visible-expr="!!{error}" ws>
            Error

            <Button
               onClick={(e, {store}) => {
                  store.delete("error");
                  store.delete("counter");
               }}
            >
               Retry
            </Button>
         </div>
         <div
            onExplore={(ctx, {store}) => {
               if (store.get("counter") > 5)
                  throw new Error("Greska");
            }}
            ws
         >
            <Button
               onClick={(e, {store}) => {
                  store.update("counter", c => (c || 0) + 1)
               }}>
               ++
            </Button>
            <span text-bind="counter" />
         </div>
      </Restate>
      Content After
   </div>
</cx>