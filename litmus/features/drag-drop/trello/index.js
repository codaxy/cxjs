import {DragSource, DropZone, DragHandle, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

import {reorder} from '../reorder';
import {insertElement} from '../insertElement';
import Controller from './Controller';

export default <cx>
   <section controller={Controller} class="board">
      <h3>Trello Clone</h3>

      <div class="cards">

         <Repeater records:bind="cards" recordName="$card" indexName="$cardIndex">

            <DropZone
               mod="hspace"
               style="display: block"
               onDragTest={e=>e.data.type == 'card'}
               onDragDrop={(e, {store}) => {
                  store.update('cards', reorder, e.data.index, 0);
               }}
               nearDistance={false}
               matchWidth
            />

            <DragSource
               class="card"
               data={{
                  index: {bind: "$cardIndex"},
                  type: 'card'
               }}
               puppetMargin={30}
               hideOnDrag
               handled
            >
               <DragHandle style="cursor:move">
                  <h4 ws>
                     &#9776;
                     <Text bind="$card.name" />
                  </h4>
               </DragHandle>
               <DropZone
                  mod="space"
                  style="display: block"
                  onDragTest={e=>e.data.type == 'item'}
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
                     data={{
                        index: {bind: "$index"},
                        cardIndex: {bind: "$cardIndex"},
                        type: 'item'
                     }}
                     puppetMargin={10}
                     hideOnDrag
                  >
                     <div text:bind="$record.text" style="padding:5px"/>
                  </DragSource>
                  <DropZone
                     mod="space"
                     style="display: block"
                     onDragTest={e=>e.data.type == 'item'}
                     onDragDrop={(e, {store}) => {
                        if (e.data.cardIndex == store.get('$cardIndex'))
                           store.update('$card.items', reorder, e.data.index, store.get('$index') + 1);
                        else {
                           let el = e.store.get('$record');
                           console.log('A');
                           e.store.update('$card.items', items => items.filter(item => item != el));
                           console.log('B');
                           store.update('$card.items', insertElement, store.get('$index') + 1, el);
                           console.log('C');
                        }
                     }}
                     nearDistance={false}
                     matchHeight
                  />
               </Repeater>
            </DragSource>

            <DropZone
               mod="hspace"
               style="display: block"
               onDragTest={e=>e.data.type == 'card'}
               onDragDrop={(e, {store}) => {
                  store.update('cards', reorder, e.data.index, store.get('$cardIndex') + 1);
               }}
               nearDistance={false}
               matchWidth
            />

         </Repeater>
      </div>

   </section>
</cx>;

