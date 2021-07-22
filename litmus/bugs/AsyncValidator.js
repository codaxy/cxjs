import { LabelsTopLayout, Repeater, Rescope } from 'cx/ui';
import { Button, HtmlElement, Sandbox, Switch, TextField, ValidationGroup } from 'cx/widgets';

let validate1 = () => Math.random();
let validate2 = (value, instance, params) =>
   new Promise(resolve => setTimeout(() => resolve(`${Math.random()} ${value} ${JSON.stringify(params)}`), 300));

export default (
   <cx>
      <div style="padding: 10px">
         <ValidationGroup
            valid-bind="valid1"
            errors-bind="errors1"
            layout={LabelsTopLayout}
         >
            <TextField
               label="Sync"
               validationParams={{ check: { bind: "check1" } }}
               value-bind="test1"
               onValidate={validate1}
            />
         </ValidationGroup>

         <Switch value-bind="check1">Hit me</Switch>
         <br />
         <Button text="Clear" onClick={(e, { store }) => store.delete("test1")} />
         <ul style="color: red">
            <Repeater records-bind="errors1">
               <li text-tpl="{$record.message}" />
            </Repeater>
         </ul>
         <br />
         <br />

         <ValidationGroup
            valid-bind="valid2"
            errors-bind="errors2"
            layout={LabelsTopLayout}
         >
            <TextField
               label="Async"
               validationParams={{ check: { bind: "check2" } }}
               value-bind="test2"
               onValidate={validate2}
            />
         </ValidationGroup>
         <Switch value-bind="check2">Hit me</Switch>
         <br />
         <Button text="Clear" onClick={(e, { store }) => store.delete("test2")} />
         <ul style="color: red">
            <Repeater records-bind="errors2">
               <li text-tpl="{$record.message}" />
            </Repeater>
         </ul>
         <br />
         <br />

      </div>
   </cx>
);