export type ObjectEntries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];


export function mapObject<T, R>(
    obj: T,
    fn: <K extends keyof T>(key: K, value: T[K]) => R
): R[] {
    return (Object.entries(obj||{}) as ObjectEntries<T>).map(([key, value]) =>
        fn(key, value)
    );
}
