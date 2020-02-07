import {
   Menu,
   Submenu,
   Text,
   Button,
   TextField,
   FlexRow,
   Checkbox,
   MenuItem
} from "cx/widgets";
import { MsgBox } from "cx/widgets";
import { FirstVisibleChildLayout } from "cx/ui";
import { addFiddleStar, removeFiddleStar } from "app/api/stars";

function star(e, { store }) {
   if (!store.get("user.email")) {
      MsgBox.alert("You need to sign in to star fiddles.");
      return;
   }

   let star = store.get("star");
   let starred = star && star.starred;

   if (!starred)
      addFiddleStar(store.get("fiddle.fiddleId")).then(s =>
         store.set("star", s)
      );
   else
      removeFiddleStar(store.get("fiddle.fiddleId")).then(s =>
         store.set("star", s)
      );
}

function togglePreviewMode(e, { store }) {
   e.preventDefault();
   store.toggle("preview.on");
}

function fileMenu(phone) {
   return (
      <cx>
         <a class="cxm-menu-pad" href="#" onClick="newFiddle">
            New
         </a>
         <a class="cxm-menu-pad" href="#" onClick="open" visible={phone}>
            Open
         </a>
         <MenuItem
            visible:expr="{user.email} != null"
            layout={FirstVisibleChildLayout}
         >
            <span class="cxm-menu-pad" visible:expr="{saving}">
               Saving...
            </span>
            <a
               class="cxm-menu-pad"
               href="#"
               onClick="save"
               visible:expr="{dirty} && (!{fiddle.fiddleId} || {fiddle.owned})"
            >
               Save
            </a>
            <a
               class="cxm-menu-pad"
               href="#"
               onClick="save"
               visible:expr="{dirty} && !{fiddle.owned}"
            >
               Fork
            </a>
            <span class="cxm-menu-pad">
               <i class="fa fa-check" /> Saved
            </span>
         </MenuItem>

         <a class="cxm-menu-pad" href="#" onClick="duplicate">
            Duplicate
         </a>
         <a
            class="cxm-menu-pad"
            href="#"
            onClick="deleteFiddle"
            visible:expr="{fiddle.fiddleId} != null"
         >
            Delete
         </a>
      </cx>
   );
}

function mainMenu(phone) {
   if (phone) return <cx>
      <Menu mod="main">
         <a class="cxm-menu-pad" href="#" onClick={star}>
            <i
               class={{
                  fa: true,
                  "fa-star": { expr: "{star.starred}" },
                  "fa-star-o": { expr: "!{star.starred}" }
               }}
            />
         </a>
      </Menu>
   </cx>;

   return (
      <cx>
         <Submenu>
            <a>Fiddle</a>
            <Menu putInto="dropdown">{fileMenu(false)}</Menu>
         </Submenu>
         <a class="cxm-menu-pad" href="#" onClick="open">
            Open
         </a>
         <Menu.Item
            visible:expr="{user.email} != null"
            layout={FirstVisibleChildLayout}
         >
            <span class="cxm-menu-pad" visible:expr="{saving}">
               Saving...
            </span>
            <a
               class="cxm-menu-pad"
               href="#"
               onClick="save"
               visible:expr="{dirty} && (!{fiddle.fiddleId} || {fiddle.owned})"
            >
               Save
            </a>
            <a
               class="cxm-menu-pad"
               href="#"
               onClick="save"
               visible:expr="{dirty} && !{fiddle.owned}"
            >
               Fork
            </a>
            <span class="cxm-menu-pad">
               <i class="fa fa-check" /> Saved
            </span>
         </Menu.Item>
         <Submenu visible:expr="{fiddle.owned} && {fiddle.fiddleId}">
            <a>
               <i
                  class={{
                     fa: true,
                     "fa-lock": { expr: "!{fiddle.isPublic}" },
                     "fa-unlock-alt": { expr: "{fiddle.isPublic}" }
                  }}
               />
            </a>
            <div
               style="width:200px;height:200px;padding:20px;white-space:normal"
               putInto="dropdown"
            >
               <div visible:expr="!{fiddle.isPublic}">
                  <p>
                     This is a private fiddle which can be accessed only by you
                     and the people who have a link to it.
                  </p>
                  <Button onClick="publish" focusOnMouseDown>
                     Make it public
                  </Button>
               </div>
               <div visible:expr="!!{fiddle.isPublic}">
                  git
                  <p>This is fiddle is public.</p>
                  <Button onClick="unpublish" focusOnMouseDown>
                     Hide it
                  </Button>
               </div>
               <p>
                  <Checkbox value:bind="fiddle.allowsAdminChanges">
                     This fiddle allows administrator changes
                  </Checkbox>
               </p>
            </div>
         </Submenu>
      </cx>
   );
}

let userInfo = (
   <cx>
      <a
         href="#"
         class="cxm-menu-pad"
         onClick="signInDialog"
         visible:expr="!{user.email}"
      >
         Sign In
      </a>
      <Submenu visible:expr="{user.email}">
         <span text:tpl="{user.email}">
            <Text tpl="{user.email}" />
         </span>
         <Menu putInto="dropdown">
            <a href="#" class="cxm-menu-pad" onClick="signOut">
               Sign Out
            </a>
         </Menu>
      </Submenu>
   </cx>
);

let rightMenu = phone => {
   if (phone) {
      return (
         <cx>
            <Button onClick={togglePreviewMode} icon-expr="{preview.on} ? 'play' : 'stop'" mod="hollow" />
         </cx>
      );
   }

   return userInfo;
};

let middle = phone => {
   return (
      <cx>
         <TextField
            value:bind="fiddle.fiddleName"
            mod="fiddle-name"
            placeholder="Unnamed Fiddle"
            style={ phone ? "flex:auto;margin:0" : null }
         />
         <Menu horizontal mod="main" visible={!phone}>
            <a class="cxm-menu-pad" href="#" onClick={star}>
               <i
                  class={{
                     fa: true,
                     "fa-star": { expr: "{star.starred}" },
                     "fa-star-o": { expr: "!{star.starred}" }
                  }}
               />
            </a>
         </Menu>
      </cx>
   );
};

export const Header = phone => [
   <cx>
      <header class="cxb-toolbar">
         <div class="cxe-toolbar-left" style={phone ? "flex: 0 0 auto" : null}>
            <Menu horizontal mod="main" itemPadding="medium">
               {mainMenu(phone)}
            </Menu>
         </div>
         <div class="cxe-toolbar-center">{middle(phone)}</div>
         <div class="cxe-toolbar-right" style={phone ? "flex: 0 0 auto" : null}>
            <Menu horizontal mod="main" itemPadding="medium">
               {rightMenu(phone)}
            </Menu>
         </div>
      </header>
   </cx>
];
