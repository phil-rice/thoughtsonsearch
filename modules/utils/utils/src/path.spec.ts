
// Jest Tests
import {pathToValue} from "./path";

describe('pathToValue', () => {
    test('retrieves nested value', () => {
        const data = { a: { b: { c: 42 } } };
        expect(pathToValue(data, 'a.b.c')).toBe(42);
    });

    test('returns undefined for missing path', () => {
        const data = { a: { b: {} } };
        expect(pathToValue(data, 'a.b.c')).toBeUndefined();
    });

    test('handles null values', () => {
        const data = { a: { b: null } };
        expect(pathToValue(data, 'a.b')).toBeNull();
        expect(pathToValue(data, 'a.b.c')).toBeUndefined();
    });

    test('returns undefined for non-existing root key', () => {
        const data = { a: {} };
        expect(pathToValue(data, 'x.y.z')).toBeUndefined();
    });

    test('retrieves object when path is partial', () => {
        const data = { a: { b: { c: 42 } } };
        expect(pathToValue(data, 'a.b')).toEqual({ c: 42 });
        expect(pathToValue(data, 'a')).toEqual({ b: { c: 42 } });
    });

    test('handles empty object', () => {
        expect(pathToValue({}, 'a.b.c')).toBeUndefined();
    });

    test('handles null object', () => {
        expect(pathToValue(null, 'a.b.c')).toBeUndefined();
    });
});
