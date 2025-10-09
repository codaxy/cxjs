interface SyntheticEvent<T> {
   stopPropagation(): void;
   preventDefault(): void;
}

export function stopPropagation(e: SyntheticEvent<any>): void {
   e.stopPropagation();
}

export function preventDefault(e: SyntheticEvent<any>): void {
   e.preventDefault();
}
