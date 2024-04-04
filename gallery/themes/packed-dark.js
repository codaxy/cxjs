import style from "./packed-dark.useable.scss";
import { registerTheme } from "./index";
import { applyThemeOverrides } from "cx-theme-packed-dark/src";

registerTheme("packed-dark", style, applyThemeOverrides);
