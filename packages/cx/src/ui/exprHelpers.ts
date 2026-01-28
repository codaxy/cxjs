import { computable } from "../data/computable";
import { AccessorChain } from "../data/createAccessorModelProxy";
import { Selector } from "../data/Selector";
import { Format } from "../util/Format";
import { expr } from "./expr";

/** Returns a selector that converts the value to boolean using !! */
export function truthy<V>(arg: AccessorChain<V>): Selector<boolean> {
   return expr(arg, (x) => !!x);
}

/** Returns a selector that checks if the value is falsy using ! */
export function falsy<V>(arg: AccessorChain<V>): Selector<boolean> {
   return expr(arg, (x) => !x);
}

/** Returns a selector that checks if the value is strictly true (=== true) */
export function isTrue(arg: AccessorChain<any>): Selector<boolean> {
   return expr(arg, (x) => x === true);
}

/** Returns a selector that checks if the value is strictly false (=== false) */
export function isFalse(arg: AccessorChain<any>): Selector<boolean> {
   return expr(arg, (x) => x === false);
}

/** Returns a selector that checks if the value is not null or undefined (x != null) */
export function hasValue<V>(arg: AccessorChain<V>): Selector<boolean> {
   return expr(arg, (x) => x != null);
}

/** Returns a selector that checks if a string or array is empty (null, undefined, or length === 0) */
export function isEmpty(arg: AccessorChain<string | any[] | null | undefined>): Selector<boolean> {
   return expr(arg, (x) => x == null || x.length === 0);
}

/** Returns a selector that checks if a string or array is non-empty (not null/undefined and length > 0) */
export function isNonEmpty(arg: AccessorChain<string | any[] | null | undefined>): Selector<boolean> {
   return expr(arg, (x) => x != null && x.length > 0);
}

/** Returns a selector that checks if the value is less than the given value */
export function lessThan<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x < value);
}

/** Returns a selector that checks if the value is less than or equal to the given value */
export function lessThanOrEqual<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x <= value);
}

/** Returns a selector that checks if the value is greater than the given value */
export function greaterThan<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x > value);
}

/** Returns a selector that checks if the value is greater than or equal to the given value */
export function greaterThanOrEqual<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x >= value);
}

/** Returns a selector that checks if the value equals the given value using == */
export function equal<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x == value);
}

/** Returns a selector that checks if the value does not equal the given value using != */
export function notEqual<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x != value);
}

/** Returns a selector that checks if the value strictly equals the given value using === */
export function strictEqual<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x === value);
}

/** Returns a selector that checks if the value strictly does not equal the given value using !== */
export function strictNotEqual<V>(arg: AccessorChain<V>, value: V): Selector<boolean> {
   return expr(arg, (x) => x !== value);
}

/** Returns a selector that formats the value using the specified format string.
 * Format strings use semicolon-separated syntax: "formatType;param1;param2"
 * @param arg - The accessor chain to the value
 * @param fmt - The format string
 * @param nullText - Optional text to display for null/undefined values
 * @example
 * format(m.price, "n;2") // formats as number with 2 decimal places
 * format(m.date, "d") // formats as date
 * format(m.value, "p;0;2") // formats as percentage with 0-2 decimal places
 * format(m.value, "n;2", "N/A") // shows "N/A" for null values
 */
export function format<V>(arg: AccessorChain<V>, fmt: string, nullText?: string): Selector<string> {
   let f = nullText != null ? `${fmt}|${nullText}` : fmt;
   return computable(arg, (x) => Format.value(x, f));
}
