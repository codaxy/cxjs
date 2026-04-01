import { Controller, Url, History } from 'cx/ui';
import { MsgBox } from 'cx/widgets';
import {transpile} from 'app/core/transpiler';
import {addMissingImports} from 'app/core/addImports';
import {reformatCode} from 'app/core/reformatCode';
import {createFiddle, updateFiddle, deleteFiddle} from 'app/api/fiddles';
import {openOpenDialog} from 'app/components/OpenDialog';

import Route from 'route-parser';
import {getToken} from 'app/api/token';
import {getFiddle} from 'app/api/fiddles';
import {getFiddleStar} from 'app/api/stars';
import 'whatwg-fetch';
import { parse } from "query-string";

export default class extends Controller {
   init() {
      super.init();

      let f = this.store.get('qs.f');
      let fiddle = this.store.get('fiddle');

      if (f && !fiddle) {
         //fix for additional query params
         if (f.indexOf('&') != -1)
            f = f.substring(0, f.indexOf('&'));

         this.store.set('loading', true);

         getFiddle(f)
            .then(x => {
               this.store.set('loading', false);
               this.store.set('fiddle', x);
            })
            .catch(e => {
               this.store.set('loading', false);
               MsgBox.alert('Error occurred while loading fiddle.');
               console.log(e);
            })
      }
   }
}

