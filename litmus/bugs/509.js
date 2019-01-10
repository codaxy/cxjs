import {HtmlElement, UploadButton, MsgBox, Menu, Submenu, MenuItem} from "cx/widgets";

function onUploadStarting(xhr, instance, file) {
   if (file.type.indexOf("image/") != 0) {
      MsgBox.alert("Only images are allowed.");
      return false;
   }

   if (file.size > 15e6) {
      MsgBox.alert("The file is too large.");
      return false;
   }
}

function onUploadComplete(xhr, instance) {
   MsgBox.alert(`Upload completed with status ${xhr.status}.`);
}

function onUploadError(e) {
   console.log(e);
}

export default (
   <cx>
      <div class="widgets">
         <Menu horizontal>
            <Submenu>
               Test
               <div putInto="dropdown" style="padding: 20px">
                  <MenuItem autoClose={false}>
                     <UploadButton
                        url="https://api.cxjs.io/uploads"
                        onUploadStarting={onUploadStarting}
                        onUploadComplete={onUploadComplete}
                        onUploadError={onUploadError}
                     >
                        Upload
                     </UploadButton>
                  </MenuItem>
               </div>
            </Submenu>
         </Menu>

         <UploadButton
            url="https://api.cxjs.io/uploads"
            onUploadStarting={onUploadStarting}
            onUploadComplete={onUploadComplete}
            onUploadError={onUploadError}
         >
            Upload
         </UploadButton>

      </div>
   </cx>
);
