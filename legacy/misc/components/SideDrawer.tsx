import { createFunctionalComponent } from "cx/ui";
import { Overlay } from "cx/widgets";

export const SideDrawer = createFunctionalComponent(({ out, children }: any) => (
   <cx>
      <Overlay backdrop class="master_sidedrawer" visible={out} animate>
         {children}
      </Overlay>
   </cx>
));
