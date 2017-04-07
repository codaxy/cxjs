import {Widget, VDOM} from '../../ui/Widget';
import {LinkButton} from './LinkButton';

export class Link extends LinkButton {}

Link.prototype.baseClass = "link";

Widget.alias('link', Link);