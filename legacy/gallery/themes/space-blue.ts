// @ts-ignore
import style from "./space-blue.useable.scss";
import { registerTheme } from "./index";

import { applyThemeOverrides } from "cx-theme-space-blue";

registerTheme("space-blue", style, applyThemeOverrides);
