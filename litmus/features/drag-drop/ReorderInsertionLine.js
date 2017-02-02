import {DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

import {reorder} from './reorder';

export default <cx>
   <section>
      <h3>Drag & Drop</h3>
      <h4>Insertion Line</h4>

      <div style="width:300px">
         <DropZone
            mod="hline"
            inflate={20}
            onDrop={(e, {store}) => {
               store.update('items', reorder, e.source.data.index, 0);
            }}
            nearDistance={false}
         >
         </DropZone>
         <Repeater
            records={{
               bind: 'items', defaultValue: Array.from({length: 20}, (_, i) => ({
                  id: i + 1,
                  text: `Item ${i + 1}`
               }))
            }}
            keyField="id"
         >
            <DragSource
               style="display:block; border: 1px solid #eee"
               data={{index: {bind: "$index"}}}
            >
               <div text:bind="$record.text" style="padding:5px"/>
            </DragSource>
            <DropZone mod="hline"
               inflate={20}
               onDrop={(e, {store}) => {
                  store.update('items', reorder, e.source.data.index, store.get('$index') + 1);
               }}
               nearDistance={false}
            >
            </DropZone>
         </Repeater>
      </div>

   </section>
</cx>;

