import { DateField, DateTimeField, HtmlElement } from "cx/widgets";

export default (
   <cx>
      <div>
         <DateField value:bind="$page.date1" />
         <DateTimeField value:bind="$page.date2" visible={false} />
      </div>
   </cx>
);
