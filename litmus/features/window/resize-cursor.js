import { Window } from "cx/widgets";

// The resize cursor should show up on the window edges and be cleared on the way back in, falling back to
// pointer (from the draggable CSS class) on the left and crosshair (from the inline style) on the right.

export default (
   <cx>
      <Window
         title="draggable + resizable"
         style={{ top: "100px", left: "40px", width: "380px", height: "220px" }}
         draggable
         resizable
      />
      <Window
         title="resizable, inline cursor"
         style={{ top: "100px", left: "460px", width: "380px", height: "220px", cursor: "crosshair" }}
         resizable
      />
   </cx>
);
