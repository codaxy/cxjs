import { Button, DateTimeField, DateField, HtmlElement, Toast } from "cx/widgets";

export default (
   <cx>
      <div>
         <Button
            onClick={(e, { store, parentOptions }) => {
               let toast = Toast.create({
                  items: (
                     <cx>
                        <DateField value:bind="$date" />
                        <DateTimeField value:bind="$avalue" />
                        <Button
                           onClick={(e, { store, parentOptions }) =>
                              parentOptions.dismiss()}
                        >
                           Close
                        </Button>
                     </cx>
                  )
               });
               toast.open(store);
            }}
         >
            Click me
         </Button>
      </div>
   </cx>
);
