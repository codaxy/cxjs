import {DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

import {reorder} from './reorder';

export default <cx>
   <section>
      <h3>Drag & Drop</h3>
      <h4>Reorder</h4>

      <div>
         <DropZone
            mod="inline-block"
            onDrop={(e, {store}) => {
               store.update('items', reorder, e.source.data.index, 0);
            }}
            matchWidth
            matchHeight
            matchMargin
            inflate={50}
         >
         </DropZone>
         <Repeater
            records={{
               bind: 'items', defaultValue: Array.from({length: 10}, (_, i) => ({
                  id: i + 1,
                  text: `Item ${i + 1}`
               }))
            }}
            keyField="id"
         >
            <DragSource
               style="display:inline-block; margin: 5px; background: #ddf"
               data={{index: {bind: "$index"}}}
               hideOnDrag
            >
               <div text:bind="$record.text" style="padding:5px"/>
            </DragSource>
            <DropZone
               mod="inline-block"
               onDrop={(e, {store}) => {
                  store.update('items', reorder, e.source.data.index, store.get('$index') + 1);
               }}
               matchWidth
               matchHeight
               matchMargin
               inflate={50}
            >
            </DropZone>
         </Repeater>
      </div>

   </section>
</cx>;

