import style from "./marine.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "cx-theme-marine";

registerTheme("marine", style, applyThemeOverrides);