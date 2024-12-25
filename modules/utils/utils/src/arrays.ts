export function uniqueStrings<T>(arr: T[]): T[] {
    const result: T[] = [];
    const set = new Set<string>();
    for (const item of arr) {
        const s = item.toString();
        if (!set.has(s)) {
            result.push(item);
            set.add(s);
        }
    }
    return result;
}