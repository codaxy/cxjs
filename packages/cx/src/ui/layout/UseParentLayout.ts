import { PureContainer } from "../PureContainer";

export class UseParentLayout extends PureContainer {
   noLayout?: boolean;   
}

UseParentLayout.prototype.noLayout = true;
UseParentLayout.prototype.useParentLayout = true;
