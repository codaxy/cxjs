import style from "./space-blue.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "../../packages/cx-theme-space-blue/src/index";

registerTheme("space-blue", style, applyThemeOverrides);