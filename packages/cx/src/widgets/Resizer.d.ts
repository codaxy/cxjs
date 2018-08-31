import {
   Widget,
   StyledContainerProps
} from 'cx/src/core';

interface ResizerProps extends StyledContainerProps {

   /** Make splitter horizontal. */
   horizontal?: boolean;

   /** Use the element after the the splitter for size measurements. */
   forNextElement?: boolean,

   /** A binding for the new size. */
   value?: Cx.NumberProp,

   /** Default value that will be set when the user double click on the splitter. */
   defaultValue?: Cx.NumberProp,

   /** Minimum size of the element. */
   minValue?: Cx.NumberProp,

   /** Maximum size of the element. */
   maxValue?: Cx.NumberProp,
}

export class Resizer extends Widget<ResizerProps> {}
