import {parseLens, serializeLens, tokenizePath} from "./lens.serialisation";

describe('Path Tokenizer', () => {
    it('should tokenize a simple path', () => {
        const serialized = 'a.b.c';
        const tokens = tokenizePath(serialized);
        expect(tokens).toEqual(['a', 'b', 'c']);
    });

    it('should tokenize a nested path with braces', () => {
        const serialized = 'a.{x:x1.x2,y:y1.{n:n1}}.y.z';
        const tokens = tokenizePath(serialized);
        expect(tokens).toEqual([
            'a', '{', 'x', ':', 'x1', 'x2', ',', 'y', ':', 'y1', '{', 'n', ':', 'n1', '}', '}', 'y', 'z'
        ]);
    });

    it('should tokenize a path with special characters escaped', () => {
        const serialized = 'a\\.key.{x\\.key:x1}';
        const tokens = tokenizePath(serialized);
        expect(tokens).toEqual(['a.key', '{', 'x.key', ':', 'x1', '}']);
    });

    it('should tokenize a path with numbers', () => {
        const serialized = 'a.0.{x:1,y:2}';
        const tokens = tokenizePath(serialized);
        expect(tokens).toEqual(['a', 0, '{', 'x', ':', 1, ',', 'y', ':', 2, '}']);
    });

    it('should handle empty braces', () => {
        const serialized = 'a.{}';
        const tokens = tokenizePath(serialized);
        expect(tokens).toEqual(['a', '{', '}']);
    });

    it('should throw an error on invalid escape sequences', () => {
        const serialized = 'a.\\';
        expect(() => tokenizePath(serialized)).toThrow('Incomplete escape sequence at end of string');
    });

    it('should throw an error on unexpected characters', () => {
        const serialized = 'a.@';
        expect(() => tokenizePath(serialized)).toThrow("Unexpected character '@' at position 2");
    });
});

describe('parseLens / serialisation', () => {
    it('should parse a simple path', () => {
        const serialized = 'a.b.c';
        const result = parseLens(serialized);
        expect(result).toEqual(['a', 'b', 'c']);
        const roundTrip = serializeLens(result);
        expect(roundTrip).toEqual(serialized);
    });

    it('should parse a nested path', () => {
        const serialized = 'a.{x:x1.x2,y:y1.{n:n1}}.y.z';
        const result = parseLens(serialized);
        expect(result).toEqual([
            'a',
            {
                x: ['x1', 'x2'],
                y: ['y1', { n: ['n1'] }]
            },
            'y',
            'z'
        ]);
        const roundTrip = serializeLens(result);
        expect(roundTrip).toEqual(serialized);
    });

    it('should handle escaped characters in keys', () => {
        const serialized = 'a\\.key.{x\\.key:x1}';
        const result = parseLens(serialized);
        expect(result).toEqual([
            'a.key',
            {
                'x.key': ['x1']
            }
        ]);
        const roundTrip = serializeLens(result);
        expect(roundTrip).toEqual(serialized);
    });

    it('should parse paths with numbers', () => {
        const serialized = 'a.0.{x:1,y:2}';
        const result = parseLens(serialized);
        expect(result).toEqual([
            'a',
            0,
            {
                x: [1],
                y: [2]
            }
        ]);
        const roundTrip = serializeLens(result);
        expect(roundTrip).toEqual(serialized);
    });

    it('should throw an error for invalid input', () => {
        const serialized = 'a.{x:x1,y:{}}z';
        expect(() => parseLens(serialized)).toThrow();
    });

    it('should throw an error for mismatched brackets', () => {
        const serialized = 'a.{x:x1.{y:y2}}.z}';
        expect(() => parseLens(serialized)).toThrow('Unexpected tokens remaining at position');
    });

    it('should throw an error for empty braces with no content', () => {
        const serialized = 'a.{}';
        expect(() => parseLens(serialized)).toThrow("Unexpected '}' at position 3");
    });

    it('should throw an error for not finishing a nested structure', () => {
        const serialized = 'a.{x:x1,y:y1';
        expect(() => parseLens(serialized)).toThrow("Unexpected end of context. Expected a }. This object started at 2");
    });
});
