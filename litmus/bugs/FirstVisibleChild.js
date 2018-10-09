import {LabelsLeftLayout, FirstVisibleChildLayout, PureContainer, UseParentLayout} from "cx/ui";
import {TextField, Route, Checkbox, LabeledContainer} from "cx/widgets";

export default <cx>
   <div layout={FirstVisibleChildLayout} visible={false}>
      <div visible={false}>1</div>
      <PureContainer>
         <div visible={false}>2</div>
         <Route url="1" route="2">
            Test
         </Route>
      </PureContainer>
      <div>3</div>
      <div>4</div>
   </div>

      <div layout={LabelsLeftLayout}>
         <LabeledContainer label="123">
            132132
         </LabeledContainer>
         {/*<TextField value:bind="$page.text" label="Label 1"/>*/}
         {/*<Checkbox value:bind="$page.showSection1">Show More</Checkbox>*/}
         {/*<PureContainer layout={UseParentLayout} visible:bind="$page.showSection1">*/}
            {/*<TextField value:bind="$page.text" label="Label 1"/>*/}
            {/*<TextField value:bind="$page.text" label="Label 2"/>*/}
            {/*<Checkbox value:bind="$page.showSection2">Show More</Checkbox>*/}
            {/*<PureContainer layout={UseParentLayout} visible:bind="$page.showSection2">*/}
               {/*<TextField value:bind="$page.text" label="Label 3"/>*/}
               {/*<TextField value:bind="$page.text" label="Label 4"/>*/}
            {/*</PureContainer>*/}
         {/*</PureContainer>*/}
   </div>

</cx>