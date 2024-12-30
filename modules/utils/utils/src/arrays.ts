export function uniqueStrings<T extends { toString(): string }>(arr: T[]): T[] {
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

export function interleave<X, Y>(
    record: Record<string, X>,
    mapFn: (x: X) => Y[],
    N: number
): Y[] {
    const result: Y[] = [];
    const arrays = Object.values(record).map(mapFn);

    let i = 0;
    let added = true;

    while (added) {
        added = false;
        for (const arr of arrays) {
            if (arr.length > i) {
                result.push(arr[i]);
                added = true;
                if (result.length >= N) {
                    return result;
                }
            }
        }
        i++;
    }

    return result;
}

export function interleaveUntilMax<X, Y>(
    record: Record<string, X>,
    mapFn: (x: X) => Y[],
    max: number
): Y[] {
    const result: Y[] = [];
    const arrays = Object.values(record).map(mapFn);

    let i = 0;
    let added = true;

    while (result.length < max && added) {
        added = false;
        for (const arr of arrays) {
            if (arr.length > i) {
                result.push(arr[i]);
                added = true;
            }
            if (result.length >= max) {
                return result;
            }
        }
        i++;
    }

    return result;
}
