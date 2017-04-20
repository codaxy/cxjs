type ElementFilter = (el: Element, condition: (el: Element) => boolean) => Element | null;

/** 
 * Returns first child element, or the parent element itself, that satisfies the `condition` function.
 * @param el
 * @param condition
 * @returns {Element}
 */
export const findFirst: ElementFilter;

export const findFirstChild : ElementFilter;

export const closest: ElementFilter;

export const closestParent: ElementFilter;

export function isFocused(el: Element) : boolean;

export function isFocusedDeep(el: Element) : boolean;

export function isFocusable(el: Element) : boolean;

/** 
 * Returns focused element.
 * @returns {Element}
 */
export function getFocusedElement() : Element;


export function isDescendant(el: Element, descEl: Element) : boolean;

export function isSelfOrDescendant(el: Element, descEl: Element) : boolean;

