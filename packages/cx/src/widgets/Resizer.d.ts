import {
   Widget,
   StyledContainerProps
} from 'cx/src/core';

interface ResizerProps extends StyledContainerProps {

   /** Make resizer horizontal. */
   horizontal?: boolean;

   /** Use the element after the the resizer for size measurements. */
   forNextElement?: boolean,

   /** A binding for the new size. */
   size?: Cx.NumberProp,

   /** Default value that will be set when the user double click on the resizer. */
   defaultSize?: Cx.NumberProp,

   /** Minimum size of the element. */
   minSize?: Cx.NumberProp,

   /** Maximum size of the element. */
   maxSize?: Cx.NumberProp,
}

export class Resizer extends Widget<ResizerProps> {}
