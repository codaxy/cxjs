// Reproduction: a field's value binding STYLE decides whether the store slot
// is initialized. Binding objects ({bind: ...}, including the value-bind
// shorthand) seed the path with the field's emptyValue (null) the moment the
// widget initializes — before any user interaction — because
// StructuredSelector.getSelectorConfig collects the declared prop default
// (Field.prototype.emptyValue) into defaultValues and init() writes them.
// Accessor-chain bindings take the isAccessorChain branch, which registers no
// default, so the slot stays undefined until the user types.
//
// Expect on load: bindString and bindObject already present as null in the
// dump; chain absent until you type into the third field.
//
// Run: import Demo from "./bugs/FieldBindingObjectNullSeeding"; in litmus/index.js
import { computable } from "cx/ui";
import { createAccessorModelProxy } from "cx/data";
import { TextField } from "cx/widgets";

const { $page } = createAccessorModelProxy();

export default (
   <cx>
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 10px; max-width: 500px">
         <TextField value-bind="$page.bindString" label="value-bind shorthand" style="width: 300px" />
         <TextField
            value={{ bind: "$page.bindObject", debounce: 500 }}
            label="{bind, debounce} object"
           
         />
         <TextField value={$page.chain} label="accessor chain" style="width: 300px" />

         <h4 style="margin-bottom: 0">$page store contents</h4>
         <pre
            style="background: #f3f3f3; padding: 10px"
            text={computable("$page", (page) => {
               let keys = Object.keys(page || {});
               return `keys: [${keys.join(", ")}]\n\n` + JSON.stringify(page, null, 2);
            })}
         />
      </div>
   </cx>
);
