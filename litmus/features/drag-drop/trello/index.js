import {DragSource, DropZone, DragHandle, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

import {reorder} from '../reorder';
import {insertElement} from '../insertElement';
import Controller from './Controller';

export default <cx>
   <section controller={Controller} class="board">
      <h3>Trello Clone</h3>

      <div class="cards">

         <DropZone
            mod="hspace"
            style="display: block;"
            onDragTest={e=>e.source.data.type == 'card'}
            onDragDrop={(e, {store}) => {
               store.update('cards', reorder, e.source.data.index, 0);
            }}
            matchWidth
            matchHeight
            matchMargin
            inflate={30}
         />

         <Repeater records:bind="cards" recordName="$card" indexName="$cardIndex">
            <DragSource
               class="card"
               data={{
                  index: {bind: "$cardIndex"},
                  type: 'card'
               }}
               hideOnDrag
               handled
            >
               <DragHandle style="cursor:move;padding:1px">
                  <h4 ws>
                     &#9776;
                     <Text bind="$card.name" />
                  </h4>
               </DragHandle>
               <DropZone
                  mod="space"
                  style="display: block"
                  onDragTest={e=>e.source.data.type == 'item'}
                  onDragDrop={(e, {store}) => {
                     store.update('$card.items', reorder, e.source.data.index, 0);
                  }}
                  matchHeight
                  matchMargin
                  inflate={8}
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
                     hideOnDrag
                  >
                     <div text:bind="$record.text" style="padding:5px"/>
                  </DragSource>
                  <DropZone
                     mod="space"
                     style="display: block"
                     onDragTest={e=>e.source.data.type == 'item'}
                     onDragDrop={(e, {store}) => {
                        if (e.source.data.cardIndex == store.get('$cardIndex'))
                           store.update('$card.items', reorder, e.source.data.index, store.get('$index') + 1);
                        else {
                           let el = e.source.store.get('$record');
                           e.source.store.update('$card.items', items => items.filter(item => item != el));
                           store.update('$card.items', insertElement, store.get('$index') + 1, el);
                        }
                     }}
                     nearDistance={false}
                     matchHeight
                     matchMargin
                     inflate={8}
                  />
               </Repeater>
            </DragSource>

            <DropZone
               mod="hspace"
               style="display: block"
               onDragTest={e=>e.source.data.type == 'card'}
               onDragDrop={(e, {store}) => {
                  store.update('cards', reorder, e.source.data.index, store.get('$cardIndex') + 1);
               }}
               matchWidth
               matchHeight
               matchMargin
               inflate={30}
            />

         </Repeater>
      </div>

   </section>
</cx>;

