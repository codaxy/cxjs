import {createFunctionalComponent, Controller, LabelsTopLayout, UseParentLayout} from "cx/ui";
import {Restate, LookupField} from "cx/widgets";

const SuperLookup = createFunctionalComponent(({value, label, detached}) => {
   class SuperController extends Controller {
      onInit() {
         setTimeout(() => {
            this.store.set('options', [{
               id: 1,
               text: 'Option #1'
            }, {
               id: 2,
               text: 'Option #2'
            }])
         }, 1000)
      }
   }

   return <cx>
      <Restate
         data={{
            value
         }}
         layout={UseParentLayout}
         detached={detached}
         controller={SuperController}
      >
         <LookupField value-bind="value" options-bind="options" label={label} />
      </Restate>
   </cx>
});


export default <cx>
   <div layout={{ type: LabelsTopLayout, vertical: true }} style="padding: 20px; background: lightgray">
      <SuperLookup value-bind="s" label="Label"/>
      <SuperLookup value-bind="s" label="Label"/>
   </div>

   <div layout={{ type: LabelsTopLayout, vertical: true }} style="padding: 20px; background: lightgray">
      <SuperLookup value-bind="s" label="Label" detached />
      <SuperLookup value-bind="s" label="Label" detached />
   </div>
</cx>