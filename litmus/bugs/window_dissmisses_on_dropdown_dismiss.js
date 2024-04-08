import { Button, Dropdown, TextField, Window } from "cx/widgets";

export default (
   <cx>
      <Button text="Show window" onClick={() => showWindow()} />
   </cx>
);

function showWindow() {
   let w = Window.create({
      title: "Window",
      style: "width: 300px; height: 200px",
      children: (
         <cx>
            <TextField value-bind="$page.query" focused-bind="$page.showSuggestions" trackFocus icon="search" />
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>
            <div>Display search results here.</div>

            <Dropdown
               visible-bind="$page.showSuggestions"
               offset={1}
               placementOrder="down-right up-right"
               style="padding: 20px; height: 100px"
               matchWidth
               // prevents dimiss on parent scroll
               closeOnScrollDistance={1000000}
            />
         </cx>
      ),
   });

   w.open();
}
