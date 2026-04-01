// @ts-ignore
import style from "./material-dark.useable.scss";
import { registerTheme } from "./index";

import { applyThemeOverrides } from "cx-theme-material-dark";

registerTheme("material-dark", style, applyThemeOverrides);
