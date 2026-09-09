import { openContextMenu } from "cx/widgets";
import { Controller } from "cx/ui";
import { IFramePortal } from "./IFramePortal";

// Bug repro: ContextMenu has dismissOnFocusOut enabled by default. Its content
// below embeds a same-origin iframe (via IFramePortal) with a focusable text
// input. Right-click the box to open the menu, then click inside the
// iframe's input field - the menu should stay open, since focus never
// actually left the menu.
//
// Before the fix: the outer document's `document.activeElement` only ever
// reports the <iframe> element itself as focused, and Node.contains() cannot
// see across the document boundary into the iframe's own document, so
// FocusManager treated this as focus leaving the menu entirely and dismissed
// it immediately.

class PageController extends Controller {}

export default (
  <cx>
    <div
      controller={PageController}
      style="font-family: sans-serif; padding: 16px; display: flex; flexDirection: column;"
    >
      <p style="max-width: 480px; margin: 0 0 16px;">
        Right-click the box below to open a ContextMenu, then click inside the
        embedded iframe's text input. The menu should remain open while
        that field has focus.
      </p>
      <div
        onContextMenu={(e, instance) =>
          openContextMenu(
            e,
            <cx>
              <div style="padding: 8px;">
                <div style="margin-bottom: 8px;">
                  Menu content with an embedded iframe:
                </div>
                <IFramePortal
                  style={{ width: "260px", height: "90px", border: "1px solid #999" }}
                >
                  <div style="padding: 8px; font-family: sans-serif;">
                    <input type="text" placeholder="Focus me" style="width: 100%;" />
                  </div>
                </IFramePortal>
              </div>
            </cx>,
            instance,
          )
        }
        style="padding: 40px; border: 1px dashed #999; width: 300px; text-align: center;"
      >
        Right Click Here
      </div>
    </div>
  </cx>
);
