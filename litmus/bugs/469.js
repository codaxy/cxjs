import {
   Button,
   Checkbox,
   DateField,
   HtmlElement,
   Overlay,
   TextArea,
   TextField,
   Window
} from "cx/widgets";
import { LabelsLeftLayout } from "cx/ui";

export default (
   <cx>
      <div class="widgets">
         <Button
            onClick={(e, { store }) => {
               let window = Window.create(
                  <cx>
                     <Window title="Contact" center style={{ width: "500px" }} modal>
                        <div
                           style={{ padding: "20px" }}
                           layout={{ type: LabelsLeftLayout, mod: "stretch" }}
                        >
                           <Button
                              onClick={(e, { store }) => {
                                 store.set("visible", true);
                              }}
                           >
                              Open using "visible"
                           </Button>
                           <Button
                              onClick={(e, { store }) => {
                                 let window = Window.create(
                                    <cx>
                                       <Window
                                          title="Window 2"
                                          center
                                          style={{ width: "500px" }}
                                          modal
                                       >
                                          <div
                                             style={{ padding: "20px" }}
                                             layout={{
                                                type: LabelsLeftLayout,
                                                mod: "stretch"
                                             }}
                                          >
                                             testing...
                                          </div>
                                          <div
                                             putInto="footer"
                                             style={{ float: "right" }}
                                             trimWhitespace={false}
                                          >
                                             <Button mod="primary">Submit</Button>
                                             <Button dismiss>Cancel</Button>
                                          </div>
                                       </Window>
                                    </cx>
                                 );

                                 window.open();
                              }}
                           >
                              Open using Window.create
                           </Button>
                           <Window
                              title="Window 2"
                              center
                              style={{ width: "500px" }}
                              modal
                              visible-bind="visible"
                           >
                              <div
                                 style={{ padding: "20px" }}
                                 layout={{ type: LabelsLeftLayout, mod: "stretch" }}
                              >
                                 testing...
                              </div>
                              <div
                                 putInto="footer"
                                 style={{ float: "right" }}
                                 trimWhitespace={false}
                              >
                                 <Button mod="primary">Submit</Button>
                                 <Button dismiss>Cancel</Button>
                              </div>
                           </Window>
                        </div>
                        <div
                           putInto="footer"
                           style={{ float: "right" }}
                           trimWhitespace={false}
                        >
                           <Button mod="primary">Submit</Button>
                           <Button
                              onClick={(e, ins) => {
                                 ins.parentOptions.dismiss();
                              }}
                           >
                              Cancel
                           </Button>
                        </div>
                     </Window>
                  </cx>
               );
               window.open();
            }}
         >
            Open
         </Button>
      </div>
   </cx>
);
