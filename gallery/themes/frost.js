import style from "./frost.useable.scss";
import {registerTheme} from './index';
import {applyThemeOverrides} from "cx-theme-frost";

registerTheme("frost", style, applyThemeOverrides);