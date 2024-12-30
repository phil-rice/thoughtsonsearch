import {mapObject} from "./objects";


interface TestObject {
    foo: number;
    bar: string;
    baz: boolean;
}

describe('mapObject', () => {
    it('maps over object entries correctly', () => {
        const input: TestObject = { foo: 1, bar: 'test', baz: true };
        const result = mapObject(input, (key, value) => `${key}:${String(value)}`);

        expect(result).toEqual(['foo:1', 'bar:test', 'baz:true']);
    });

    it('returns an empty array for empty objects', () => {
        const result = mapObject({}, (key, value) => `${key}:${String(value)}`);
        expect(result).toEqual([]);
    });

    it('returns an empty array for null or undefined', () => {
        const result1 = mapObject(null as any, (key, value) => {throw new Error('Should not be called')});
        const result2 = mapObject(undefined as any, (key, value) => {throw new Error('Should not be called')});


        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
    });

    it('preserves key-value types', () => {
        const input: TestObject = { foo: 42, bar: 'hello', baz: false };
        const result = mapObject(input, (key, value) => {
            if (key === 'foo') {
                expect(typeof value).toBe('number');
            } else if (key === 'bar') {
                expect(typeof value).toBe('string');
            } else if (key === 'baz') {
                expect(typeof value).toBe('boolean');
            }
            return value;
        });

        expect(result).toEqual([42, 'hello', false]);
    });
});
