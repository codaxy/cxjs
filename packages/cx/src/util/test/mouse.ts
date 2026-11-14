import { commands } from "vitest/browser";

// Mouse gestures that userEvent cannot express, run with Playwright's page.mouse (see vitest.commands.ts).
// Points are in the test frame's coordinates, as returned by getBoundingClientRect.

export interface MouseStep {
   move?: { x: number; y: number; steps?: number };
   down?: boolean;
   up?: boolean;
   /** A double click at the given point, with all the mouse events of a real one, including dblclick. */
   dblclick?: { x: number; y: number };
}

declare module "vitest/browser" {
   interface BrowserCommands {
      mouse: (steps: MouseStep[]) => Promise<void>;
   }
}

export interface DragOptions {
   /** Point within the source element, relative to its top-left corner. Defaults to the center. */
   sourcePosition?: { x: number; y: number };
   /** Point within the target element, relative to its top-left corner. Defaults to the center. */
   targetPosition?: { x: number; y: number };
   /** Number of intermediate mouse moves on the way to the target. */
   steps?: number;
}

function point(element: Element, position?: { x: number; y: number }) {
   let r = element.getBoundingClientRect();
   return position
      ? { x: r.left + position.x, y: r.top + position.y }
      : { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/**
 * Drags with the mouse from `source` to `target`, with intermediate moves like a real drag. Unlike
 * userEvent.dragAndDrop, which moves straight to the target, this starts drag operations that are detected
 * by mouse movement over the source element, as in CxJS.
 */
export async function drag(source: Element, target: Element, options: DragOptions = {}) {
   let start = point(source, options.sourcePosition);
   let end = point(target, options.targetPosition);
   await commands.mouse([
      { move: start },
      { down: true },
      // leave the source a little, so that the drag is detected over the source element
      { move: { x: start.x + 6, y: start.y + 6, steps: 3 } },
      { move: { ...end, steps: options.steps ?? 10 } },
      { up: true },
   ]);
}
