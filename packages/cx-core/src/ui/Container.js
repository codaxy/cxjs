import {HtmlElement} from './HtmlElement';
import {Debug, deprecatedFlag} from '../util/Debug';

Debug.log(deprecatedFlag, 'Container widget is deprecated since v16.8. It will be removed in future versions. Use HtmlElement instead.');

export class Container extends HtmlElement {}
