import {HtmlElement} from './HtmlElement';
import {debug, deprecatedFlag} from '../util/Debug';

debug(deprecatedFlag, 'Container widget is deprecated since v16.8. It will be removed in future versions. Use HtmlElement instead.');

export class Container extends HtmlElement {}
