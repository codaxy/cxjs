import * as Cx from '../core';

export class Localization {
    static register(key: string): (any) => any;

    static registerPrototype(key: string, type: any): void;

    static override(key: string, values: Cx.Record): void;

    static localize(culture: string, key: string, values: Cx.Record): void;

    static setCulture(culture: string): void;

    static trackDefaults();

    static restoreDefaults();
}
