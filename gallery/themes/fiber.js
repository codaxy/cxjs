import style from "./fiber.useable.scss";
import {registerTheme} from './index';

import {applyThemeOverrides} from "cx-theme-fiber";

registerTheme("fiber", style, applyThemeOverrides);