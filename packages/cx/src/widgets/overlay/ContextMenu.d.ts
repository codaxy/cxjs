import * as Cx from '../../core';
import {View} from '../../data/View';
import { DropdownProps } from './Dropdown';

export interface ContextMenuProps extends DropdownProps {}

export class ContextMenu extends Cx.Widget<ContextMenuProps> {}

export function opentContextMenu(e: MouseEvent, contents: any, store?: View, options?: any);