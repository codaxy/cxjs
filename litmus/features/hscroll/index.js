import {HtmlElement, Tab, HScroller} from "cx/widgets";

export default (
   <cx>
      <div style="padding: 10px;" ws>
         <HScroller style="max-width: 400px">
            <Tab value:bind="tab" tab="1">Tab1</Tab>
            <Tab value:bind="tab" tab="2">Tab2</Tab>
            <Tab value:bind="tab" tab="3">Tab3</Tab>
            <Tab value:bind="tab" tab="4">Tab4</Tab>
            <Tab value:bind="tab" tab="5">Tab5</Tab>
            <Tab value:bind="tab" tab="6">Tab6</Tab>
            <Tab value:bind="tab" tab="7">Tab7</Tab>
            <Tab value:bind="tab" tab="8">Tab8</Tab>
            <Tab value:bind="tab" tab="9">Tab9</Tab>
            <Tab value:bind="tab" tab="10">Tab10</Tab>
         </HScroller>
      </div>
   </cx>
);
