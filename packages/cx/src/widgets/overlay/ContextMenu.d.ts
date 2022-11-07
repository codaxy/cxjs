import * as Cx from "../../core";
import { View } from "../../data/View";
import { Instance } from "../../ui";
import { DropdownProps } from "./Dropdown";

export interface ContextMenuProps extends DropdownProps {}

export class ContextMenu extends Cx.Widget<ContextMenuProps> {}

export function openContextMenu(e: MouseEvent, contents: any, storeOrInstance?: View | Instance, options?: any);
