import {HtmlElement, Grid, FlexRow, DragHandle} from 'cx/widgets';

import Controller from './Controller';

import {insertElement} from '../insertElement';

function move(store, target, e) {

   store.update(e.source.data.source, array => array.filter((a, i) => i != e.source.record.index));

   if (e.source.data.source == target && e.source.record.index <= e.target.insertionIndex)
      e.target.insertionIndex--;

   store.update(target, insertElement, e.target.insertionIndex, e.source.record.data);
}

export default <cx>
   <div controller={Controller} style="padding:30px">
      <h3>Grid to Grid Drag & Drop</h3>

      <FlexRow>
         <Grid
            records:bind="grid1"
            columns={[{
               field: 'name',
               header: 'Name',
               sortable: true,
               style: 'width: 300px'
            }, {
               field: 'number',
               header: 'Number',
               format: 'n;2',
               sortable: true,
               align: 'right'
            }]}
            dragSource={{
               type: 'record',
               source: 'grid1'
            }}
            onDragTest={e=>e.source.data.type == 'record'}
            onDragDrop={(e, {store})=>move(store, "grid1", e)}
         />

         <div style="width:100px"/>

         <Grid
            records:bind="grid2"
            columns={[{
               items: <cx>
                  <DragHandle style="cursor:pointer">
                     &#9776;
                  </DragHandle>
               </cx>
            }, {
               style: 'width: 300px',
               field: 'name',
               header: 'Name',
               sortable: true
            }, {
               field: 'number',
               header: 'Number',
               format: 'n;2',
               sortable: true,
               align: 'right'
            }]}
            dragSource={{
               type: 'record',
               source: 'grid2'
            }}
            onDragTest={e=>e.source.data.type == 'record'}
            onDragDrop={(e, {store})=>move(store, "grid2", e)}
         />
      </FlexRow>
   </div>
</cx>;
