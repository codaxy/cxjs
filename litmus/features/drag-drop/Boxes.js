import {DragSource, DropZone, HtmlElement, Repeater, Text, MsgBox} from 'cx/widgets';

export default <cx>
   <section>
      <h3>Drag & Drop</h3>

      <DragSource
         style="padding: 10px; background: yellow; display:inline-block"
         data={{index: {bind: "$index"}}}>
         Drag me around
      </DragSource>

      <Repeater records={Array.from({length: 200})}>
         <DropZone
            style="padding: 10px; border: 1px solid lightgray; margin: 5px; display: inline-block; opacity: 0.05;"
            farStyle="opacity: 0.1;"
            nearStyle="opacity: 0.5;"
            overStyle="background: greenyellow;opacity: 1;"
            onDrop={(e, {store}) => {
               MsgBox.alert(`Dropped at #${store.get('$index') + 1}.`);
            }}
            nearDistance={200}
         >
            Drop #<Text tpl="{[{$index}+1]}"/>
         </DropZone>
      </Repeater>

   </section>
</cx>;

