import { describe, it } from "vitest";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
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
