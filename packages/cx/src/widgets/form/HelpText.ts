import { Widget } from '../../ui/Widget';
import { HtmlElement } from '../HtmlElement';

export class HelpText extends HtmlElement {}

HelpText.prototype.tag = 'span';
HelpText.prototype.baseClass = 'helptext';

Widget.alias('help-text', HelpText);
