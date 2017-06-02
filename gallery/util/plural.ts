import {Format} from "cx/ui";
import plural from "plural";

Format.registerFactory('plural', (format, text) => {
   return value => plural(text, value);
});
