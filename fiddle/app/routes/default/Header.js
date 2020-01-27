import {
   Menu,
   Submenu,
   Text,
   Button,
   TextField,
   Icon,
   FlexRow,
   Checkbox,
   MenuItem
} from "cx/widgets";
import { HtmlElement, PureContainer, MsgBox } from "cx/widgets";
import { FirstVisibleChildLayout } from "cx/ui";
import { getFiddleStars, addFiddleStar, removeFiddleStar } from "app/api/stars";

function star(e, { store }) {
   if (!store.get("user.email")) {
      MsgBox.alert("You need to sign in to star fiddles.");
      return;
   }

   var star = store.get("star");
   var starred = star && star.starred;

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
         <hr />
         <a class="cxm-menu-pad" href="#">
            About
         </a>
      </cx>
   );
}

function mainMenu(phone) {
   if (phone) return null;

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

         <a href="https://cxjs.io/quickstart" target="_blank">
            Build
         </a>
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
            <Submenu>
               <span>
                  <i class="fa fa-bars" />
               </span>
               <Menu putInto="dropdown">
                  {fileMenu(true)}
                  <hr />
                  {userInfo}
               </Menu>
            </Submenu>
         </cx>
      );
   }

   return userInfo;
};

let middle = phone => {
   if (phone) return null;

   return (
      <cx>
         <TextField
            value:bind="fiddle.fiddleName"
            mod="fiddle-name"
            placeholder="Unnamed Fiddle"
         />
         <Menu horizonta mod="main">
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

let line2 = phone => {
   if (!phone) return null;
   return (
      <cx>
         <FlexRow align="center">
            <Menu horizonta mod="main">
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
            <TextField
               value:bind="fiddle.fiddleName"
               mod="fiddle-name"
               placeholder="Unnamed Fiddle"
               style="flex:auto;margin:0"
            />
            <Menu horizonta mod="main">
               <a class="cxm-menu-pad" href="#" onClick={togglePreviewMode}>
                  <i
                     class={{
                        fa: true,
                        "fa-play": { expr: "!{preview.on}" },
                        "fa-stop": { expr: "!!{preview.on}" }
                     }}
                  />
               </a>
            </Menu>
         </FlexRow>
      </cx>
   );
};

export const Header = phone => [
   <cx>
      <header class="cxb-toolbar">
         <div class="cxe-toolbar-left">
            <Menu horizontal mod="main" itemPadding="medium">
               <MenuItem>
                  <a href="https://cxjs.io/">
                     <Icon name="cx" class="cx-logo" />
                     <h1>CxJS</h1>
                  </a>
               </MenuItem>
               {mainMenu(phone)}
            </Menu>
         </div>
         <div class="cxe-toolbar-center">{middle(phone)}</div>
         <div class="cxe-toolbar-right">
            <Menu horizontal mod="main" itemPadding="medium">
               {rightMenu(phone)}
            </Menu>
         </div>
      </header>
   </cx>,
   line2(phone)
];
