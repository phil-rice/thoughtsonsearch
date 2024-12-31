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
        //@ts-ignore - Object.entries is not typed correctly. This method exists so that we only need to worry about that here
        Object.entries(rec).map(([k, v]: [Key, T], i) => [k as Key, fn(v, k as Key, i)])
    ) as Record<Key, R>;
}
