import {DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

import {reorder} from '../reorder';
import Controller from './Controller';

export default <cx>
   <section controller={Controller} class="board">
      <h3>Trello Clone</h3>

      <div class="cards">
         <DropZone
            mod="hspace"
            style="display: block"
            onDragDrop={(e, {store}) => {
               store.update('cards', reorder, e.data.index, 0);
            }}
            nearDistance={false}
            matchWidth
         />
         <Repeater records:bind="cards" recordName="$card">

            <DragSource
               class="card"
               data={{index: {bind: "$index"}}}
               puppetMargin={10}
               hideOnDrag
            >
               <h4 text:bind="$card.name"/>
               <DropZone
                  mod="space"
                  style="display: block"
                  onDragDrop={(e, {store}) => {
                     store.update('$card.items', reorder, e.data.index, 0);
                  }}
                  nearDistance={false}
                  matchHeight
               />
               <Repeater
                  records:bind="$card.items"
                  keyField="id"
               >
                  <DragSource
                     class="item"
                     data={{index: {bind: "$index"}}}
                     puppetMargin={10}
                     hideOnDrag
                  >
                     <div text:bind="$record.text" style="padding:5px"/>
                  </DragSource>
                  <DropZone
                     mod="space"
                     style="display: block"
                     onDragDrop={(e, {store}) => {
                        store.update('$card.items', reorder, e.data.index, store.get('$index') + 1);
                     }}
                     nearDistance={false}
                     matchHeight
                  />
               </Repeater>
            </DragSource>

            <DropZone
               mod="hspace"
               style="display: block"
               onDragDrop={(e, {store}) => {
                  store.update('cards', reorder, e.data.index, 0);
               }}
               nearDistance={false}
               matchWidth
            />

         </Repeater>
      </div>

   </section>
</cx>;

