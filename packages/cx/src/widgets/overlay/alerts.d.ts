import * as Cx from '../../core';

export function alert(options: string | Cx.Config): Promise<void>;

export function yesNo(options: string | Cx.Config): Promise<string>;

export function registerAlertImpl(impl: { alert: any, yesNo: any });
