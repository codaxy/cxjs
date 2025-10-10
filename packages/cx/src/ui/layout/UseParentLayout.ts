import { PureContainer } from "../PureContainer";

export class UseParentLayout extends PureContainer {
   noLayout?: boolean;
   useParentLayout?: boolean;
}

UseParentLayout.prototype.noLayout = true;
UseParentLayout.prototype.useParentLayout = true;
