import style from "./queenblue.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "../../packages/cx-theme-queenblue/src/index";

registerTheme("queenblue", style, applyThemeOverrides);