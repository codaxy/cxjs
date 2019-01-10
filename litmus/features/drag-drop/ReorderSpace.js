import {DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

import {reorder} from './reorder';

export default <cx>
   <section>
      <h3>Drag & Drop</h3>
      <h4>Reorder</h4>
      <br/>

      <div style="width:300px">
         <DropZone
            mod="block"
            onDrop={(e, {store}) => {
               store.update('items', reorder, e.source.data.index, 0);
            }}
            matchHeight
            matchMargin
            inflate={300}
         >
         </DropZone>
         <Repeater
            records={{
               bind: 'items', defaultValue: Array.from({length: 20}, (_, i) => ({
                  id: i + 1,
                  text: `Item ${i + 1}`,
                  height: 30 + Math.random() * 300
               }))
            }}
            keyField="id"
         >
            <DragSource
               style:tpl="display:block; border: 1px solid #ccc;margin-top:2px;background:#eee;height:{$record.height}px"
               data={{index: {bind: "$index"}}}
               hideOnDrag
            >
               <div text:bind="$record.text" style="padding:5px"/>
            </DragSource>
            <DropZone mod="block"
               onDrop={(e, {store}) => {
                  store.update('items', reorder, e.source.data.index, store.get('$index') + 1);
               }}
               matchHeight
               matchMargin
               inflate={300}
            >
            </DropZone>
         </Repeater>
      </div>

   </section>
</cx>;

