import {HtmlElement} from '../HtmlElement';
import {Widget} from '../../ui/Widget';

export class HelpText extends HtmlElement {}

HelpText.prototype.tag = 'span';
HelpText.prototype.baseClass = 'helptext';

Widget.alias('help-text', HelpText);
