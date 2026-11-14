// Browser commands run in Node, next to Playwright, and are called from tests through `commands` from "vitest/browser".
import type { BrowserCommand } from "vitest/node";
import type { MouseStep } from "./src/util/test/mouse";

// Playwright's page.mouse, for gestures that userEvent cannot express, such as a drag with intermediate moves.
// Tests run in an iframe, so points are translated (and scaled, if the frame is scaled to fit) to page coordinates.
export const mouse: BrowserCommand<[steps: MouseStep[]]> = async (context, steps) => {
   if (context.provider.name != "playwright") throw new Error("The mouse command requires the Playwright provider.");
   let { page } = context as any;
   let frame = await (context as any).frame();
   let box = await (await frame.frameElement()).boundingBox();
   let width = await frame.evaluate(() => window.innerWidth);
   let scale = box.width / width;
   for (let step of steps) {
      if (step.move)
         await page.mouse.move(box.x + step.move.x * scale, box.y + step.move.y * scale, {
            steps: step.move.steps ?? 1,
         });
      if (step.down) await page.mouse.down();
      if (step.up) await page.mouse.up();
      if (step.dblclick) await page.mouse.dblclick(box.x + step.dblclick.x * scale, box.y + step.dblclick.y * scale);
   }
};
