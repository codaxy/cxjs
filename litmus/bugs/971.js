import { Culture, Localization } from "cx/ui";
import { Calendar } from "cx/widgets";

Localization.setCulture("de-DE");
Culture.setCulture("de-DE");

export default (
   <cx>
      <div>
         <Calendar value-bind="date" startWithMonday={false} />
      </div>
   </cx>
);
