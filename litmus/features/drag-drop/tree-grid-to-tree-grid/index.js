import { HtmlElement, Grid, FlexRow, DragHandle, Window, TreeNode } from 'cx/widgets';
import { KeySelection, TreeAdapter } from 'cx/ui';

import Controller from './Controller';

import { insertElement } from '../insertElement';

function move(store, target, e) {
   if (e.source.data.source == target)
      e.source.records.forEach(record => {
         if (record.index < e.target.insertionIndex)
            e.target.insertionIndex--;
      });

   let selection = e.source.records.map(r => r.data);
   store.update(e.source.data.source, array => array.filter((a, i) => selection.indexOf(a) == -1));
   store.update(target, insertElement, e.target.insertionIndex, ...selection);
}

function drop(store, target, e) {
   if (!!e.dataTransfer)
      alert('DROP FILES');
   else
      alert('DROP' + JSON.stringify(e.source.data));
}

export default <cx>
   <div controller={Controller} style="padding:30px">
      <h3>Grid to Grid Drag & Drop</h3>

      <FlexRow>
         <Grid
            records-bind="grid1"
            dataAdapter={{
               type: TreeAdapter,
               childrenField: 'children',
            }}
            allowsFileDrops
            scrollable
            style="height:400px"
            columns={[{
               field: 'name',
               header: 'Name',
               sortable: true,
               style: 'width: 300px',
               items: <cx>
                  <TreeNode text-bind="$record.name" expanded-bind="$record.$expanded" leaf-bind="$record.leaf" />
               </cx>
            }, {
               field: 'number',
               header: 'Number',
               format: 'n;2',
               sortable: true,
               align: 'right'
            }]}
            dragSource={{
               data: {
                  type: 'record',
                  source: 'grid1'
               }
            }}
            dropZone={{
               mode: 'insertion'
            }}
            onDropTest={e => e.source?.data?.type == 'record'}
            onDrop={(e, { store }) => move(store, "grid1", e)}
            onRowDropTest={e => !!e.dataTransfer || e.source.data.type == 'record'}
            onRowDrop={(e, { store }) => drop(store, "grid1", e)}
            selection={{
               type: KeySelection,
               multiple: true,
               bind: 's1'
            }}
            keyField="id"
         />

         <div style="width:100px" />

         <Grid
            records-bind="grid2"
            buffered
            scrollable
            allowsFileDrops
            style="height:400px"
            columns={[{
               items: <cx>
                  <DragHandle style="cursor:move">
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
               mode: 'copy',
               data: {
                  type: 'record',
                  source: 'grid2'
               }
            }}
            dropZone={{
               mode: 'insertion'
            }}
            onDropTest={e => !!e.dataTransfer || e.source.data.type == 'record'}
            onDrop={(e, { store }) => move(store, "grid2", e)}
            keyField="id"
         />
      </FlexRow>


      <div style="height: 1000px" />
   </div>
</cx>;
