import {FlexCol, FlexRow, HtmlElement} from "cx/widgets";

export default (
   <cx>
      <div>
         <h3> Fixed Height </h3>
         <FlexRow wrap spacing="xlarge" pad="xlarge">
            <FlexRow style="height: 200px; width: 200px; border:1px solid gray">
               <div style="flex: 1; background: yellow;">
                  flex: 1
               </div>
               <div style="flex: 1; background: green">
                  flex: 1
               </div>
            </FlexRow>

            <FlexRow style="height: 200px; width: 200px; border:1px solid gray" hspacing>
               <div style="flex: 1; background: yellow;">
                  hspacing
               </div>
               <div style="flex: 1; background: green">

               </div>
            </FlexRow>

            <FlexRow style="height: 200px; width: 200px; border:1px solid gray" hpad>
               <div style="flex: 1; background: yellow;">
                  hpad
               </div>
               <div style="flex: 1; background: green">

               </div>
            </FlexRow>

            <FlexRow style="height: 200px; width: 200px; border:1px solid gray" hpad hspacing>
               <div style="flex: 1; background: yellow;">
                  hpad
               </div>
               <div style="flex: 1; background: green">
                  hspacing
               </div>
            </FlexRow>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray">
               <div style="flex: 1 0; background: yellow;">
                  flex: 1
               </div>
               <div style="flex: 1 0; background: green">
                  flex: 1
               </div>
            </FlexCol>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray" vpad>
               <div style="flex: 1 0; background: yellow;">
                  vpad
               </div>
               <div style="flex: 1 0; background: green">

               </div>
            </FlexCol>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray" vspacing>
               <div style="flex: 1 0; background: yellow;">
                  vspacing
               </div>
               <div style="flex: 1 0; background: green">

               </div>
            </FlexCol>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray" vpad vspacing>
               <div style="flex: 1 0; background: yellow;">
                  vpad
               </div>
               <div style="flex: 1 0; background: green">
                  vspacing
               </div>
            </FlexCol>

            <FlexRow style="height: 200px; width: 200px; border:1px solid gray" spacing>
               <div style="flex: 1; background: yellow;">
                  spacing
               </div>
               <div style="flex: 1; background: green">

               </div>
            </FlexRow>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray" spacing>
               <div style="flex: 1; background: yellow;">
                  spacing
               </div>
               <div style="flex: 1; background: green">

               </div>
            </FlexCol>

            <FlexRow style="height: 200px; width: 200px; border:1px solid gray" pad>
               <div style="flex: 1; background: yellow;">
                  pad
               </div>
               <div style="flex: 1; background: green">

               </div>
            </FlexRow>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray" pad>
               <div style="flex: 1; background: yellow;">
                  pad
               </div>
               <div style="flex: 1; background: green">

               </div>
            </FlexCol>

            <FlexRow style="height: 200px; width: 200px; border:1px solid gray" pad spacing>
               <div style="flex: 1; background: yellow;">
                  pad
               </div>
               <div style="flex: 1; background: green">
                  spacing
               </div>
            </FlexRow>

            <FlexCol style="height: 200px; width: 200px; border:1px solid gray" pad spacing>
               <div style="flex: 1; background: yellow;">
                  pad
               </div>
               <div style="flex: 1; background: green">
                  spacing
               </div>
            </FlexCol>
         </FlexRow>

         <h3> Natural Height </h3>

         <FlexRow wrap spacing="xlarge" pad="xlarge" align="start">
            <FlexRow style="width: 200px; border:1px solid gray">
               <div style="flex: 1; background: yellow; height: 100px">
                  flex: 1
               </div>
               <div style="flex: 1; background: green; height: 200px">
                  flex: 1
               </div>
            </FlexRow>

            <FlexCol style="width: 200px; border:1px solid gray">
               <div style="background: yellow; height: 100px">
                  flex: 1
               </div>
               <div style="background: green; height: 100px">
                  flex: 1
               </div>
            </FlexCol>
         </FlexRow>
      </div>
   </cx>
);
