import { Widget, Controller } from 'cx/ui';
import { Window, Tab, Text, Repeater, List, TextField, Pagination, FlexRow, FlexCol } from 'cx/widgets';
import { HtmlElement } from 'cx/widgets';
import { History, Url } from 'cx/ui';
import {queryFiddles} from '../api/fiddles';

export class OpenDialogController extends Controller {
   init() {
      super.init();

      if (!this.store.get('user.email') || !this.store.get('open.tab'))
         this.store.set('open.tab', 'popular');

      this.addTrigger('pageReset', ['open.tab', '$modal.query'], () => {
         this.store.set('$modal.page', 1);
         this.store.set('$modal.pageCount', 1);
      }, true);

      this.addTrigger('load', ['open.tab', '$modal.page', '$modal.query'], (list, page, query) => {
         queryFiddles({list, page, query, pageSize: 11}).then(fiddles => {
            if (fiddles.length > 10 && page + 1 > this.store.get('$modal.pageCount'))
               this.store.set('$modal.pageCount', page + 1);
            this.store.set('$modal.fiddles', fiddles);
         });
      }, true);
   }
}

export function openOpenDialog(store, callback) {

   store.set('$modal', {});
   var dialog = <cx>
      <Window title="Open Fiddle" modal={true} center={true} style="width:500px;max-width:95vw"
              controller={OpenDialogController}>
         <FlexRow pad spacing target="desktop">
            <div>
               <Tab value:bind="open.tab" tab="popular" text="Popular" mod="line"/>
               <Tab value:bind="open.tab" tab="starred" text="Starred" mod="line" disabled:expr="!{user.email}"/>
               <Tab value:bind="open.tab" tab="mine" text="Saved" mod="line" disabled:expr="!{user.email}"/>
            </div>
            <TextField value:bind="$modal.query" placeholder="Search" style="margin-left: auto"/>
         </FlexRow>
         <List records:bind="$modal.fiddles" style="height: 400px" onItemClick={(e, {store}) => {
            History.pushState({}, null, Url.resolve("~/?f=" + store.get('$record.accessCode')));
            dismiss();
         }}>
            <div class="cxe-fiddlelist-item">
               <Text bind="$record.fiddleName"/>
               <div class="cxe-fiddlelist-starmeter">
                  <span class="cxe-fiddlelist-star">&#9733;</span>
                  <Text tpl="{$record.stars}"/>
               </div>
            </div>
         </List>
         <FlexRow>
            <Pagination page:bind="$modal.page" pageCount:bind="$modal.pageCount" style="margin: 10px; margin-left: auto" />
         </FlexRow>
      </Window>
   </cx>;

   var dialog = Widget.create(dialog);
   var dismiss = dialog.open(store);
}

