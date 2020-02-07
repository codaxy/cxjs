import style from "./material-dark.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "cx-theme-material-dark/src";

registerTheme("material-dark", style, applyThemeOverrides);