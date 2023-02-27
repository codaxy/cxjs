export function createFunctionalComponent<T, X>(factory: (props: T) => X): (props: T) => X;
