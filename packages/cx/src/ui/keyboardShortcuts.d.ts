export type KeyboardShortcut = number | { keyCode: number, ctrlKey?: boolean, shiftKey?: boolean, altKey?: boolean };

export function executeKeyboardShortcuts(e: KeyboardEvent);

export function registerKeyboardShortcut(key: KeyboardShortcut, callback: (e: KeyboardEvent) => void);