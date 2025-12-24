import {Widget, VDOM} from '../../ui/Widget';
import {LinkButton, LinkButtonConfig} from './LinkButton';

export interface LinkConfig extends LinkButtonConfig {}

export class Link extends LinkButton {
   declare baseClass: string;
}

Link.prototype.baseClass = "link";

Widget.alias('link', Link);