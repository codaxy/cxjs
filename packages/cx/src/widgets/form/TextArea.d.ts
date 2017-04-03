import * as Cx from '../../core';
import { TextFieldProps } from './TextField';

interface TextAreaProps extends TextFieldProps {
   
   /** Specifies the number of visible lines. */
   rows?: Cx.NumberProp,

   /** Event used to report on a new value. Defaults to `blur`. Other permitted value is `input`. */
   reachOn?: string,
   
   suppressErrorTooltipsUntilVisited?: boolean
}

export class TextArea extends Cx.Widget<TextAreaProps> {}
