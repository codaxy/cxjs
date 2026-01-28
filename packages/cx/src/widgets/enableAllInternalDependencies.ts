import {enableTooltips} from './overlay/Tooltip';
import {enableMsgBoxAlerts} from './overlay/MsgBox';
import {enableCultureSensitiveFormatting} from '../ui/Format';
import {enableFatArrowExpansion} from '../data/enableFatArrowExpansion';

export function enableAllInternalDependencies(): void {
   enableTooltips();
   enableMsgBoxAlerts();
   enableCultureSensitiveFormatting();
   enableFatArrowExpansion();
}
