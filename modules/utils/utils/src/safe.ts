export function toArray<T>(value?: T | T[]): T[] {
    return value === undefined ? [] : Array.isArray(value) ? value : [value];
}