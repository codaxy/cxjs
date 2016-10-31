import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Overlay} from 'cx/ui/overlay/Overlay';

import configs from './configs/Overlay';

var addOverlay = store => {
   var overlay = Overlay.create(<cx>
      <Overlay style={{
         left: Math.random()*100+'%',
         top: Math.random()*100+'%',
         padding: '30px',
         border: '2px solid gray',
         textAlign: 'center'
         }}>
         This overlay will automatically close after 5s.
      </Overlay>
   </cx>);

   var close = overlay.open(store);

   setTimeout(close, 5000);
};

export const Overlays = <cx>
   <Md>
      # Overlay

      <ImportPath path={"import \{Overlay\} from 'cx/ui/overlay/Overlay';"}></ImportPath>

      Overlays are page elements which are displayed on top of the main UI. Overlays include windows,
      message boxes, dropdowns, tooltips, etc. Overlays may be defined in the widget tree context or opened
      independently. In either case, overlays are appended inside the `body` element.

      > Use the `style` property to control the position on the page.

      ### Contextual Overlays

      Contextual overlays are defined inside the widget tree and controlled using the `visible` property.
      A contextual overlay will not be shown unless its parent is visible.

      <CodeSplit>
         <div class="widgets">
            <Checkbox value:bind="$page.overlay">Show Overlay</Checkbox>
            <Overlay visible:bind="$page.overlay" style={{background: 'yellow', padding: '30px'}} draggable>
               This is an overlay.
            </Overlay>
         </div>

         <Content name="code">
            <CodeSnippet>{`
               <div class="widgets">
                  <Checkbox value:bind="$page.overlay">Show Overlay</Checkbox>
                  <Overlay visible:bind="$page.overlay" style={{background: 'yellow', padding: '30px'}} draggable>
                     This is an overlay.
                  </Overlay>
               </div>
            `}</CodeSnippet>
         </Content>

         Use the `inline` property to specify if the overlay should be rendered inline or appended to the body element.
         Note that inline overlays have `z-index` set to a very high value to get on top of the content.

      </CodeSplit>

      ### Independent Overlays

      <CodeSplit>

         Independent overlays are explicitly *opened* and will remain visible until explicitly closed.
         Independent overlays start their own application loop and require the `store` parameter.

         If a new store instance is passed, the overlay will be completely disconnected from the main UI.

         <div class="widgets">
            <button type="button"
                    onClick={(e, {store}) => { addOverlay(store); }}>
               Add Overlay
            </button>
         </div>

         <Content name="code">
            <CodeSnippet>{`
               var addOverlay = store => {
                  var overlay = Overlay.create(<cx>
                     <Overlay style={{
                        left: Math.random()*100+'%',
                        top: Math.random()*100+'%',
                        padding: '30px',
                        border: '2px solid gray',
                        textAlign: 'center'
                     }}>
                        This overlay will automatically close after 5s.
                     </Overlay>
                  </cx>);

                  var close = overlay.open(store);

                  setTimeout(close, 5000);
               };
               ...
               <button type="button"
                    onClick={(e, {store}) => { addOverlay(store); }}>
                  Add Overlay
               </button>
            `}</CodeSnippet>
         </Content>

      </CodeSplit>

      > `HINT` Switch to another article while both types of overlays are visible and then return back to this page.

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>