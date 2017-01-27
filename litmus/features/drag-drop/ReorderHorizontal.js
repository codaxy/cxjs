import { DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox } from 'cx/widgets';

import { reorder } from './reorder';

export default <cx>
   <section>
      <h3>Drag & Drop</h3>
      <h4>Reorder</h4>

      <div>
         <DropZone mod="hspace"
                   onDragDrop={(e, {store}) => {
                      store.update('items', reorder, e.data.index, 0);
                   }}
                   nearDistance={false}
         >
         </DropZone>
         <Repeater
            records={{bind: 'items', defaultValue: Array.from({length: 10}, (_, i) => ({
               id: i + 1,
               text: `Item ${i + 1}`
            }))}}
            keyField="id"
         >
            <DragSource
               style="display:inline-block; margin: 5px; background: #ddf"
               data={{ index:  {bind:"$index"}}}
               puppetMargin={10}
               hideOnDrag
            >
               <div text:bind="$record.text" style="padding:5px" />
            </DragSource>
            <DropZone mod="hspace"
               onDragDrop={(e, {store}) => {
                  store.update('items', reorder, e.data.index, store.get('$index') + 1);
               }}
               nearDistance={false}
            >
            </DropZone>
         </Repeater>
      </div>

   </section>
</cx>;

