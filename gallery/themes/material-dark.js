import style from "./material-dark.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "../../packages/cx-theme-material-dark/src/index";

registerTheme("material-dark", style, applyThemeOverrides);