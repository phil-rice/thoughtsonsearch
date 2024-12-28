import {interleave, interleaveUntilMax, uniqueStrings} from "./arrays";

describe("uniqueStrings", () => {
    it("should return unique strings", () => {
        const input = ["a", "b", "a", "c", "b"];
        const result = uniqueStrings(input);
        expect(result).toEqual(["a", "b", "c"]);
    });

    it("should return unique numbers", () => {
        const input = [1, 2, 1, 3, 2];
        const result = uniqueStrings(input);
        expect(result).toEqual([1, 2, 3]);
    });

    it("should preserve order", () => {
        const input = ["b", "a", "b", "c", "a"];
        const result = uniqueStrings(input);
        expect(result).toEqual(["b", "a", "c"]);
    })
    it("should handle empty array", () => {
        const input = [];
        const result = uniqueStrings(input);
        expect(result).toEqual([]);
    })
})

describe('interleave', () => {
    it('should interleave items from multiple arrays', () => {
        const data = {
            a: [1, 2, 3],
            b: [4, 5],
            c: [6, 7, 8, 9],
        };

        const result = interleave(data, (x) => x, 5);
        expect(result).toEqual([1, 4, 6, 2, 5]);
    });

    it('should stop when N items are reached', () => {
        const data = {
            a: [1, 2, 3],
            b: [4, 5, 6],
        };

        const result = interleave(data, (x) => x, 4);
        expect(result).toEqual([1, 4, 2, 5]);
    });

    it('should handle cases where one array is shorter than others', () => {
        const data = {
            a: [1, 2],
            b: [3, 4, 5],
            c: [6, 7, 8, 9],
        };

        const result = interleave(data, (x) => x, 6);
        expect(result).toEqual([1, 3, 6, 2, 4, 7]);
    });

    it('should return fewer than N items if not enough data is available', () => {
        const data = {
            a: [1],
            b: [2],
        };

        const result = interleave(data, (x) => x, 5);
        expect(result).toEqual([1, 2]);
    });

    it('should return an empty array if the record is empty', () => {
        const data: Record<string, number[]> = {};

        const result = interleave(data, (x) => x, 5);
        expect(result).toEqual([]);
    });

    it('should return items in correct order even if one array is empty', () => {
        const data = {
            a: [1, 2, 3],
            b: [],
            c: [4, 5],
        };

        const result = interleave(data, (x) => x, 4);
        expect(result).toEqual([1, 4, 2, 5]);
    });

    it('should handle complex mapping functions', () => {
        const data = {
            a: [1, 2, 3],
            b: [10, 20],
        };

        const result = interleave(data, (x) => x.map((y) => y * 2), 4);
        expect(result).toEqual([2, 20, 4, 40]);
    });
});

describe('interleaveUntilMax', () => {
    it('should interleave until max is reached', () => {
        const data = {
            a: [1, 2, 3],
            b: [4, 5],
            c: [6, 7, 8, 9],
        };
        const result = interleaveUntilMax(data, (x) => x, 7);
        expect(result).toEqual([1, 4, 6, 2, 5, 7, 3]);
    });

    it('should return fewer items if max exceeds total available', () => {
        const data = {
            a: [1, 2],
            b: [3],
        };
        const result = interleaveUntilMax(data, (x) => x, 10);
        expect(result).toEqual([1, 3, 2]);
    });

    it('should return an empty array if input is empty', () => {
        const data: Record<string, number[]> = {};
        const result = interleaveUntilMax(data, (x) => x, 5);
        expect(result).toEqual([]);
    });

    it('should handle cases where arrays are of uneven length', () => {
        const data = {
            a: [1],
            b: [2, 3],
            c: [4, 5, 6],
        };
        const result = interleaveUntilMax(data, (x) => x, 6);
        expect(result).toEqual([1, 2, 4, 3, 5, 6]);
    });
});
