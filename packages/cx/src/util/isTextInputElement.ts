export function isTextInputElement(el: Element): boolean {
   return el.tagName == 'INPUT' || el.tagName == 'TEXTAREA';
}