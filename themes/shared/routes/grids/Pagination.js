import { Controller } from 'cx/ui';
import { Select, Pagination, TextField, Grid, HtmlElement } from 'cx/widgets';
import { getComparer } from 'cx/data';
import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();

      var dataSet = Array.from({length: 1000}).map((v, i) => ({
         id: i + 1,
         fullName: casual.full_name,
         phone: casual.phone,
         city: casual.city
      }));

      this.store.init('$page.pageSize', 10);
      this.store.init('$page.filter', {name: null, phone: null, city: null});

      //if context changes, go to the first page
      this.addTrigger('page', ['$page.pageSize', '$page.sorters', '$page.filter'], () => {
         this.store.set('$page.page', 1);
      }, true);

      this.addTrigger('pagination', ['$page.pageSize', '$page.page', '$page.sorters', '$page.filter'], (size, page, sorters, filter) => {
         //simulate server call
         setTimeout(() => {
            var filtered = dataSet;
            if (filter) {
               if (filter.name) {
                  var checks = filter.name.split(' ').map(w => new RegExp(w, 'gi'));
                  filtered = filtered.filter(x => checks.every(ex => x.fullName.match(ex)));
               }

               if (filter.phone)
                  filtered = filtered.filter(x => x.phone.indexOf(filter.phone) != -1);

               if (filter.city)
                  filtered = filtered.filter(x => x.city.indexOf(filter.city) != -1);
            }
            var compare = getComparer((sorters || []).map(x => ({value: {bind: x.field}, direction: x.direction})));
            filtered.sort(compare); //simulate database sort
            this.store.set('$page.pagedRecords', filtered.slice((page - 1) * size, page * size));
            this.store.set('$page.pageCount', Math.ceil(filtered.length / size));
         }, 100);
      }, true);
   }
}

export default <cx>
   <div controller={PageController}>
      <Grid records:bind='$page.pagedRecords'
         style={{width: "100%"}}
         mod={["bordered", "responsive"]}
         lockColumnWidths
         columns={[
            {
               field: 'fullName',
               sortable: true,
               header1: 'Name',
               header2: {
                  allowSorting: false,
                  items: <TextField value:bind="$page.filter.name" reactOn="enter blur"
                     style="width:100%" showClear/>
               }
            },
            {
               header1: 'Phone',
               header2: {
                  items: <TextField value:bind="$page.filter.phone" reactOn="enter blur"
                     style="width:100%" showClear/>
               },
               field: 'phone',
               style: 'white-space: nowrap'
            },
            {
               header1: 'City',
               header2: {
                  allowSorting: false,
                  items: <TextField value:bind="$page.filter.city" reactOn="enter blur"
                     style="width:100%" showClear/>
               },
               field: 'city',
               sortable: true
            }
         ]}
         sorters:bind="$page.sorters"
         remoteSort
      />

      <div style="display: flex; margin-top: 20px">
         <Pagination page:bind="$page.page" pageCount:bind="$page.pageCount"/>
         <div style="flex:1" />
         <Select value:bind="$page.pageSize" style="width: 50px">
            <option value="5">5</option>
            <option value={10}>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
         </Select>
      </div>
   </div>
</cx>