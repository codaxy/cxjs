//IE sometimes returns null while other browsers always return document.body.
export function getActiveElement() {
   return document.activeElement || document.body;
}