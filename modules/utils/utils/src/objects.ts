export type ObjectEntries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];


export function mapObjectToArray<T, R>(
    obj: T,
    fn: <K extends keyof T>(key: K, value: T[K]) => R
): R[] {
    return (Object.entries(obj || {}) as ObjectEntries<T>).map(([key, value]) =>
        fn(key, value)
    );
}

export function mapRecord<Key extends string, T, R>(
    rec: Record<Key, T>,
    fn: (value: T, k: Key, i: number) => R
): Record<Key, R> {
    return Object.fromEntries(
        Object.entries(rec).map(([k, v]: [Key, T], i) => [k, fn(v, k, i)])
    ) as Record<Key, R>;
}
