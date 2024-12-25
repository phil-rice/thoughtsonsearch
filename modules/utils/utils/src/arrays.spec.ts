
import {uniqueStrings} from "./arrays";

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