import { computable, createFunctionalComponent } from "cx/ui";
import { getSelector } from "cx/data";

export const Animicon = createFunctionalComponent(({ shape, onClick }: any) => (
   <cx>
      <div
         onClick={onClick}
         class={computable(getSelector(shape), (shape) => {
            return {
               "lines-button": true,
               close: true,
               x: shape == "close",
               "arrow arrow-left": shape == "arrow",
            };
         })}
      >
         <span class="lines" />
      </div>
   </cx>
));
