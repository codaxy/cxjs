import style from "./space-blue.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "cx-theme-space-blue/src";

registerTheme("space-blue", style, applyThemeOverrides);