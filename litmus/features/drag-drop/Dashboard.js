import {DragSource, DropZone, HtmlElement, Repeater, Button, FlexCol, FlexRow, DragHandle} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {reorder} from './reorder';
import {insertElement} from './insertElement';

class PageControlller extends Controller {
   onInit() {
      this.store.init('rows', Array.from({length: 5}, (_, i) => ({
         id: i,
         widgets: []
      })));

      this.store.set('widgets', [{
         style: {
            background: 'red',
            height: '100px',
            width: '100px'
         }
      }, {
         style: {
            background: 'green',
            height: '100px',
            width: '100px'
         }
      }, {
         style: {
            background: 'orange',
            height: '100px',
            width: '150px'
         }
      }]);
   }

   addRow() {
      this.store.update('rows', rows => [...rows, {
         id: rows.length,
         widgets: []
      }]);
   }
}

const createOnWidgetDrop = (getIndex) => (e, {store}) => {
   let {index, rowIndex, widget} = e.source.data;
   let newEl = {...widget};
   if (index == -1)
      store.update('$record.widgets', insertElement, getIndex(store), newEl);
   else if (rowIndex == store.get('$rowIndex'))
      store.update('$record.widgets', reorder, index, getIndex(store));
   else {
      e.source.store.update('$record.widgets', items => items.filter(item => item != widget));
      store.update('$record.widgets', insertElement, getIndex(store), newEl);
   }
};

const Row = <cx>
   <DragSource
      style:tpl="display:block; border: 1px solid #eee; padding: 10px;"
      data={{type: 'row', index: {bind: "$rowIndex"}}}
      hideOnDrag
   >
      <FlexRow style="min-height: 100px" spacing>
         <DragHandle style="background:#eee;width: 20px; cursor: move"/>

         <Repeater
            records:bind="$record.widgets"
            recordAlias="$widget"
         >
            <DropZone mod="inline-block"
               onDropTest={e=>e.source.data.type == 'widget'}
               onDrop={createOnWidgetDrop(store => store.get('$index'))}
               matchWidth
               matchHeight
               matchMargin
               inflate={100}
            />
            <DragSource
               data={{
                  type: 'widget',
                  rowIndex: {bind: '$rowIndex'},
                  widget: {bind: '$widget'},
                  index: {bind: "$index"}
               }}
               hideOnDrag
               style:bind="$widget.style"
            />
         </Repeater>

         <DropZone
            mod="inline-block"
            style="flex:1"
            onDropTest={e=>e.source.data.type == 'widget'}
            onDrop={createOnWidgetDrop(store => -1)}
            matchWidth
            matchHeight
            matchMargin
            inflate={100}
         />


      </FlexRow>
   </DragSource>
</cx>

export default <cx>
   <div style="padding: 20px">
      <h3>Dashboard</h3>
      <FlexRow controller={PageControlller} spacing>
         <FlexCol style="width: 200px" padding spacing>
            <Repeater records:bind="widgets">
               <DragSource
                  data={{
                     type: 'widget',
                     widget: {bind: '$record'},
                     index: -1,
                     rowIndex: -1
                  }}
                  style:bind="$record.style" />
            </Repeater>
         </FlexCol>
         <FlexCol style="flex: 1" spacing>
            <DropZone
               mod="block"
               onDropTest={e=>e.source.data.type == 'row'}
               onDrop={(e, {store}) => {
                  store.update('rows', reorder, e.source.data.index, 0);
               }}
               matchHeight
               matchMargin
               inflate={300}
            >
            </DropZone>
            <Repeater
               records:bind="rows"
               keyField="id"
               indexAlias="$rowIndex"
            >
               {Row}
               <DropZone mod="block"
                  onDropTest={e=>e.source.data.type == 'row'}
                  onDrop={(e, {store}) => {
                     store.update('rows', reorder, e.source.data.index, store.get('$rowIndex') + 1);
                  }}
                  matchHeight
                  matchMargin
                  inflate={300}
               >
               </DropZone>
            </Repeater>
            <br/>
            <Button onClick="addRow">Add Row</Button>
         </FlexCol>
      </FlexRow>
   </div>
</cx>;

