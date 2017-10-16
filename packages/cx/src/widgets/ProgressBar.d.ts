import * as Cx from '../core';
import {Instance} from '../ui/Instance';

interface ProgressBarProps extends Cx.StyledContainerProps {

   /** Progress value, a number between `0` and `1`. Default value is `0`. */
   value?: Cx.NumberProp,
    
   /** Defaults to `false`. Set to `true` to make it look disabled. */
   disabled?: Cx.BooleanProp,
   
   /** Progress bar annotation. */
   text?: Cx.StringProp,
   
}

export class ProgressBar extends Cx.Widget<ProgressBarProps> {}
