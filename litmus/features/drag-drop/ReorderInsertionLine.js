import { DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox } from 'cx/widgets';

function reorder(array, sourceIndex, targetIndex) {
   if (targetIndex == sourceIndex)
      return array;

   let el = array[sourceIndex];
   let res = [...array];
   if (sourceIndex < targetIndex) {
      for (let i = sourceIndex; i + 1 < targetIndex; i++)
         res[i] = res[i + 1];
      targetIndex--;
   }
   else {
      for (let i = sourceIndex; i > targetIndex; i--)
         res[i] = res[i - 1];
   }
   res[targetIndex] = el;
   return res;
}

export default <cx>
   <section>
      <h3>Drag & Drop</h3>
      <h4>Insertion Line</h4>

      <div style="width:300px">
         <DropZone mod="insertion"
                   style="display: block"
                   onDragDrop={(e, {store}) => {
                      store.update('items', reorder, e.data.index, 0);
                   }}
                   nearDistance={false}
         >
         </DropZone>
         <Repeater
            records={{bind: 'items', defaultValue: Array.from({length: 20}, (_, i) => ({
               id: i + 1,
               text: `Item ${i + 1}`
            }))}}
            keyField="id"
         >
            <DragSource
               style="display:block; border: 1px solid #eee"
               data={{ index:  {bind:"$index"}}}
            >
               <div text:bind="$record.text" style="padding:5px" />
            </DragSource>
            <DropZone mod="insertion"
               style="display: block"
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

