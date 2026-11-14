import { afterEach } from "vitest";
import { cleanup } from "./src/util/test/render";

// React's act environment is enabled only while rendering and inside `settle` (see src/util/test/render.tsx).

afterEach(async () => {
   await cleanup();
});
