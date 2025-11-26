import { Container } from 'cx/ui';
import { StyledContainerConfig } from 'cx/ui';
import { StringProp } from 'cx/ui';

export interface ScrollIntoViewProps extends StyledContainerConfig {
   selector?: StringProp
}

export class ScrollIntoView extends Container {}
