// @ts-ignore
import style from "./packed-dark.useable.scss";
import { registerTheme } from "./index";
import { applyThemeOverrides } from "cx-theme-packed-dark";

registerTheme("packed-dark", style, applyThemeOverrides);
