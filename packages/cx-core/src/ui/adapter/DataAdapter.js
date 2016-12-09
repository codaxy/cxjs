import {Component} from '../Component';

export class DataAdapter extends Component {

   getRecords() {
      throw new Error('Abstract method');
   }

   setFilter() {

   }

   sort() {

   }
}

DataAdapter.prototype.recordName = '$record';
DataAdapter.prototype.indexName = '$index';
DataAdapter.prototype.immutable = false;