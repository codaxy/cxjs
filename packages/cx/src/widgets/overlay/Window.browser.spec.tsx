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

   it("is called once if the window is dismissed twice before it closes", async () => {
      let calls = 0;
      let controller: Controller | undefined;

      class WindowController extends Controller {
         onInit() {
            controller = this;
         }
      }

      let store = new Store({ data: { visible: true } });
      await render(
         <cx>
            <Window
               visible={m.visible}
               controller={WindowController}
               onBeforeDismiss={() => {
                  calls++;
                  return true;
               }}
            >
               Content
            </Window>
         </cx>,
         { store },
      );

      await settle(() => {
         controller!.instance.parentOptions.dismiss();
         controller!.instance.parentOptions.dismiss();
      });
      assert.equal(calls, 1);
      assert.equal(store.get(m.visible), false);
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

describe("Window onBeforeDismiss with a promise", () => {
   const m = createModel<Model>();

   function deferred() {
      let resolve!: (value: boolean) => void;
      let promise = new Promise<boolean>((r) => (resolve = r));
      return { promise, resolve };
   }

   function closeButton() {
      return document.querySelector(".cxb-window button") as HTMLElement;
   }

   async function setup() {
      let checks: ReturnType<typeof deferred>[] = [];
      let store = new Store({ data: { visible: true } });
      await render(
         <cx>
            <Window
               visible={m.visible}
               title="Edit"
               closable
               closeOnEscape
               onBeforeDismiss={() => {
                  let check = deferred();
                  checks.push(check);
                  return check.promise;
               }}
            >
               <input />
            </Window>
         </cx>,
         { store },
      );
      return { store, checks };
   }

   it("closes the window when the promise resolves to true", async () => {
      let { store, checks } = await setup();

      await settle(() => userEvent.click(closeButton()));
      assert.equal(checks.length, 1);
      assert.equal(store.get(m.visible), true);

      await settle(() => checks[0].resolve(true));
      assert.equal(store.get(m.visible), false);
   });

   it("keeps the window open when the promise resolves to false", async () => {
      let { store, checks } = await setup();

      await settle(() => userEvent.click(closeButton()));
      await settle(() => checks[0].resolve(false));
      assert.equal(store.get(m.visible), true);

      // the window can be dismissed again afterwards
      await settle(() => userEvent.click(closeButton()));
      assert.equal(checks.length, 2);
      await settle(() => checks[1].resolve(true));
      assert.equal(store.get(m.visible), false);
   });

   it("ignores other attempts to dismiss the window while the promise is pending", async () => {
      let { store, checks } = await setup();

      await settle(() => userEvent.click(closeButton()));
      document.querySelector<HTMLInputElement>(".cxb-window input")!.focus();
      await settle(() => userEvent.keyboard("{Escape}"));
      await settle(() => userEvent.click(closeButton()));
      assert.equal(checks.length, 1);

      await settle(() => checks[0].resolve(true));
      assert.equal(store.get(m.visible), false);
   });

   it("does nothing when the promise resolves after the window was closed otherwise", async () => {
      let { store, checks } = await setup();

      await settle(() => userEvent.click(closeButton()));
      await settle(() => store.set(m.visible, false));
      await expect.poll(() => document.querySelector(".cxb-window")).toBeNull();

      await settle(() => checks[0].resolve(true));
      assert.equal(store.get(m.visible), false);
   });

   it("is awaited by the dismiss function of a window opened with open", async () => {
      let check = deferred();
      let dismiss = Window.create({
         title: "Opened",
         onBeforeDismiss: () => check.promise,
         items: <cx>Content</cx>,
      }).open(new Store());
      await expect.poll(() => document.querySelector(".cxb-window")).toBeTruthy();

      dismiss();
      await settle();
      assert.ok(document.querySelector(".cxb-window"), "the window was closed");

      check.resolve(true);
      await expect.poll(() => document.querySelector(".cxb-window")).toBeNull();
   });
});
