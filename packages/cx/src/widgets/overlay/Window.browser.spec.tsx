import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Instance } from "../../ui/Instance";
import { Controller } from "../../ui/Controller";
import { render, settle } from "../../util/test/render";
import { Window } from "./Window";
import assert from "assert";

interface Model {
   visible: boolean;
}

describe("Window", () => {
   const m = createModel<Model>();

   it("can be dismissed by a controller attached to the window", async () => {
      let controller: WindowController | undefined;

      class WindowController extends Controller {
         onInit() {
            controller = this;
         }
      }

      let store = new Store({ data: { visible: true } });
      await render(
         <Window visible={m.visible} inline controller={WindowController}>
            Content
         </Window>,
         { store },
      );

      assert.ok(controller, "controller was not initialized");
      assert.equal(typeof controller.instance.parentOptions?.dismiss, "function");
      await settle(() => controller!.instance.parentOptions.dismiss());
      assert.equal(store.get(m.visible), false);
   });

   it("can be dismissed by a controller inside the window", async () => {
      let controller: ContentController | undefined;

      class ContentController extends Controller {
         onInit() {
            controller = this;
         }
      }

      let store = new Store({ data: { visible: true } });
      await render(
         <Window visible={m.visible} inline>
            <div controller={ContentController}>Content</div>
         </Window>,
         { store },
      );

      assert.ok(controller, "controller was not initialized");
      await settle(() => controller!.instance.parentOptions.dismiss());
      assert.equal(store.get(m.visible), false);
   });
});

describe("Window onBeforeDismiss", () => {
   const m = createModel<Model>();

   function closeButton() {
      return document.querySelector(".cxb-window button") as HTMLElement;
   }

   it("keeps the window open while it returns false", async () => {
      let allow = false;
      let calls: Instance[] = [];
      let store = new Store({ data: { visible: true } });
      await render(
         <cx>
            <Window
               visible={m.visible}
               title="Edit"
               closable
               closeOnEscape
               onBeforeDismiss={(instance) => {
                  calls.push(instance);
                  return allow;
               }}
            >
               <input />
            </Window>
         </cx>,
         { store },
      );

      document.querySelector<HTMLInputElement>(".cxb-window input")!.focus();
      await settle(() => userEvent.keyboard("{Escape}"));
      assert.equal(store.get(m.visible), true);

      await settle(() => userEvent.click(closeButton()));
      assert.equal(store.get(m.visible), true);

      allow = true;
      await settle(() => userEvent.click(closeButton()));
      assert.equal(store.get(m.visible), false);

      assert.equal(calls.length, 3);
      assert.ok(calls[0].widget instanceof Window);
   });

   it("calls a controller method given by name", async () => {
      let calls = 0;

      class PageController extends Controller {
         onBeforeDismiss() {
            calls++;
            return false;
         }
      }

      let store = new Store({ data: { visible: true } });
      await render(
         <cx>
            <div controller={PageController}>
               <Window visible={m.visible} title="Edit" closable onBeforeDismiss="onBeforeDismiss">
                  Content
               </Window>
            </div>
         </cx>,
         { store },
      );

      await settle(() => userEvent.click(closeButton()));
      assert.equal(calls, 1);
      assert.equal(store.get(m.visible), true);
   });

   it("is invoked by the dismiss function of a window opened with open", async () => {
      let allow = false;
      let dismiss = Window.create({
         title: "Opened",
         onBeforeDismiss: () => allow,
         items: <cx>Content</cx>,
      }).open(new Store());
      await expect.poll(() => document.querySelector(".cxb-window")).toBeTruthy();

      dismiss();
      await settle();
      assert.ok(document.querySelector(".cxb-window"), "the window was closed");

      allow = true;
      dismiss();
      await expect.poll(() => document.querySelector(".cxb-window")).toBeNull();
   });
});
