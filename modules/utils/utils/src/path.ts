export function pathToValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, key) => {
        if (acc && typeof acc === 'object') {
            return acc[key];
        }
        return undefined;
    }, obj);
}