import {mapObjectToArray, mapRecord} from "./objects";


interface TestObject {
    foo: number;
    bar: string;
    baz: boolean;
}

describe('mapObjectToArray', () => {
    it('maps over object entries correctly', () => {
        const input: TestObject = { foo: 1, bar: 'test', baz: true };
        const result = mapObjectToArray(input, (key, value) => `${key}:${String(value)}`);

        expect(result).toEqual(['foo:1', 'bar:test', 'baz:true']);
    });

    it('returns an empty array for empty objects', () => {
        const result = mapObjectToArray({}, (key, value) => `${key}:${String(value)}`);
        expect(result).toEqual([]);
    });

    it('returns an empty array for null or undefined', () => {
        const result1 = mapObjectToArray(null as any, (key, value) => {throw new Error('Should not be called')});
        const result2 = mapObjectToArray(undefined as any, (key, value) => {throw new Error('Should not be called')});


        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
    });

    it('preserves key-value types', () => {
        const input: TestObject = { foo: 42, bar: 'hello', baz: false };
        const result = mapObjectToArray(input, (key, value) => {
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


describe('mapRecord', () => {
    test('maps over non-empty record', () => {
        const input = { a: 1, b: 2, c: 3 };
        const result = mapRecord(input, (value) => value * 2);
        expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    test('returns empty object for empty record', () => {
        const result = mapRecord({}, (value) => value);
        expect(result).toEqual({});
    });

    test('handles string transformation', () => {
        const input = { a: 10, b: 20 };
        const result = mapRecord(input, (value) => `Value: ${value}`);
        expect(result).toEqual({ a: 'Value: 10', b: 'Value: 20' });
    });

    test('passes correct arguments to mapping function', () => {
        const input = { x: 1, y: 2 };
        const mockFn = jest.fn((value, key, index) => value + index);

        mapRecord(input, mockFn);

        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith(1, 'x', 0);
        expect(mockFn).toHaveBeenCalledWith(2, 'y', 1);
    });

    test('preserves keys while transforming values', () => {
        const input = { a: 5, b: 10 };
        const result = mapRecord(input, (value) => value.toString());
        expect(result).toEqual({ a: '5', b: '10' });
    });

    test('works with boolean values', () => {
        const input = { a: true, b: false };
        const result = mapRecord(input, (value) => !value);
        expect(result).toEqual({ a: false, b: true });
    });

    test('works with complex objects', () => {
        const input = {
            user1: { name: 'Alice', age: 25 },
            user2: { name: 'Bob', age: 30 }
        };
        const result = mapRecord(input, (value) => ({ ...value, age: value.age + 1 }));
        expect(result).toEqual({
            user1: { name: 'Alice', age: 26 },
            user2: { name: 'Bob', age: 31 }
        });
    });

    test('maps over record with number keys (converted to strings)', () => {
        const input = { 1: 10, 2: 20 } as Record<string, number>;
        const result = mapRecord(input, (value) => value * 2);
        expect(result).toEqual({ 1: 20, 2: 40 });
    });
});
