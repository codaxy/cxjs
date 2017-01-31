import {HtmlElement, Grid, FlexRow} from 'cx/widgets';

import Controller from './Controller';

export default <cx>
   <div controller={Controller}>
      <h3>Grid to Grid Drag & Drop</h3>

      <FlexRow justify="center">
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
         />

         <div style="width:100px"/>

         <Grid
            records:bind="grid2"
            columns={[{
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
         />
      </FlexRow>
   </div>


</cx>;
