import { afterEach } from "vitest";
import { cleanup } from "./src/util/test/createTestRenderer";

// tells React that updates are wrapped in act(...)
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
   cleanup();
});
