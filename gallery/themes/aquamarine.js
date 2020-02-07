import style from "./aquamarine.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "cx-theme-aquamarine/src";

registerTheme("aquamarine", style, applyThemeOverrides);