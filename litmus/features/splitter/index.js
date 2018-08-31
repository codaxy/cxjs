import {FlexRow, FlexCol, Resizer} from "cx/widgets";

export default <cx>
   <FlexCol style="height: 100%; padding: 5px;">
      <FlexRow style={{
         flex: {expr: "{height} ? null : '2 1 0'"},
         height: {bind: "height"}
      }}>
         <div style={{
            flex: {expr: "{width} ? null : '1 1 0'"},
            border: "1px solid red",
            width: {bind: "width"}
         }}/>
         <Resizer value-bind="width"/>
         <div style="border: 1px solid red; flex: 1 1 0;"/>
         <Resizer forNextElement value-bind="rightWidth"/>
         <div style={{
            flex: {expr: "{rightWidth} ? null : '1 1 0'"},
            border: "1px solid red",
            width: {bind: "rightWidth"}
         }}/>
      </FlexRow>
      <Resizer value-bind="height" horizontal />
      <FlexRow style="flex: 1 1 0">
         <div style={{
            flex: {expr: "{width} ? null : '1 1 0'"},
            border: "1px solid red",
            width: {bind: "width"}
         }}/>
         <Resizer value-bind="width"/>
         <div style="border: 1px solid red; flex: 1 1 0;"/>
         <Resizer forNextElement value-bind="rightWidth2"/>
         <div style={{
            flex: {expr: "{rightWidth2} ? null : '1 1 0'"},
            border: "1px solid red",
            width: {bind: "rightWidth2"}
         }}/>
      </FlexRow>
   </FlexCol>
</cx>