import { createFunctionalComponent, DataProxy, FirstVisibleChildLayout, Restate } from "cx/ui";

const TestRst = createFunctionalComponent(({ txt }) => {
   return (
      <cx>
         <Restate data={{ txt }}>
            <div text-bind="txt" visible={false} />
         </Restate>
      </cx>
   );
});

const TestDataProxy = createFunctionalComponent(({ txt }) => {
   return (
      <cx>
         <DataProxy data={{ txt }}>
            <div text-bind="txt" />
         </DataProxy>
      </cx>
   );
});

export default (
   <cx>
      <div class="widgets">
         <FirstVisibleChildLayout>
            <TestRst txt="Rst text" />
            <TestDataProxy txt="DP Text" />
         </FirstVisibleChildLayout>
      </div>
   </cx>
);
