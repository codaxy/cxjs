import { DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox } from 'cx/widgets';

export const DragDrop = <cx>
   <section>
      <h3>DragDrop</h3>
      <DragSource style="padding: 10px; background: yellow">
         Drag me around
      </DragSource>

      <Repeater records={Array.from({length: 100})}>
         <DropZone
            style="padding: 10px; border: 1px solid lightgray; margin: 5px"
            onDragDrop={(e, {store}) => {
               MsgBox.alert(`Dropped at #${store.get('$index')+1}`);
            }}
         >
            Drop here #<Text tpl="{[{$index}+1]}" />
         </DropZone>
      </Repeater>
   </section>
</cx>;

