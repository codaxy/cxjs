import * as Cx from '../../core';

export class Url {
   static resolve(path: string): string;

   static absolute(path: string): string;

   static unresolve(path: string): string;

   static getAbsoluteBase(): string;

   static isLocal(url: string): boolean;

   static setBase(base: string): void;

   static getOrigin(): string; 

   static getBaseFromScriptSrc(src: string, scriptPath: string): string;

   static setBaseFromScript(scriptPath: string);
}
