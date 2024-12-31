import {camelCase, camelCaseToWords, capitalizeFirstLetter, ellipsesInMiddle} from "./strings";

describe('camelCaseToWords', () => {
    it('converts simple camelCase strings to words', () => {
        expect(camelCaseToWords('thisText')).toBe('This Text');
        expect(camelCaseToWords('anotherExample')).toBe('Another Example');
    });

    it('handles multiple uppercase letters correctly', () => {
        expect(camelCaseToWords('HTMLParserTest')).toBe('HTML Parser Test');
        expect(camelCaseToWords('XmlHTTPRequest')).toBe('Xml HTTP Request');
    });

    it('handles single word strings', () => {
        expect(camelCaseToWords('example')).toBe('Example');
    });

    it('handles strings with numbers', () => {
        expect(camelCaseToWords('test123String')).toBe('Test 123 String');
        expect(camelCaseToWords('123startHere')).toBe('123 Start Here');
        expect(camelCaseToWords('this1Is2ATest3')).toBe('This 1 Is 2 A Test 3');
    });

    it('handles strings with special characters', () => {
        expect(camelCaseToWords('test_with_special_@')).toBe('Test_with_special_@');
        expect(camelCaseToWords('another-Test')).toBe('Another-Test');
    });

    it('handles empty strings', () => {
        expect(camelCaseToWords('')).toBe('');
    });

    it('handles strings with existing spaces', () => {
        expect(camelCaseToWords('thisText AlreadyFormatted')).toBe('This Text Already Formatted');
    });

    it('handles strings that are already properly formatted', () => {
        expect(camelCaseToWords('Already Proper')).toBe('Already Proper');
    });

    it('trims leading and trailing spaces', () => {
        expect(camelCaseToWords('  thisText  ')).toBe('This Text');
    });
});


describe('capitalizeFirstLetter', () => {
    it('capitalizes the first letter of a string', () => {
        expect(capitalizeFirstLetter('test')).toBe('Test');
        expect(capitalizeFirstLetter('another')).toBe('Another');
    });

    it('handles empty strings', () => {
        expect(capitalizeFirstLetter('')).toBe('');
    });

    it('handles strings with numbers', () => {
        expect(capitalizeFirstLetter('123test')).toBe('123test');
    });

    it('handles strings with special characters', () => {
        expect(capitalizeFirstLetter('@test')).toBe('@test');
    });

    it('handles strings with existing spaces', () => {
        expect(capitalizeFirstLetter('  test  ')).toBe('  test  ');
    });

    it('handles strings that are already properly formatted', () => {
        expect(capitalizeFirstLetter('Test')).toBe('Test');
    });
})


describe('camelCase', () => {

    test('converts space-separated words to camelCase', () => {
        expect(camelCase("hello world")).toBe("helloWorld");
    });

    test('handles single-word input', () => {
        expect(camelCase("hello")).toBe("hello");
    });

    test('converts snake_case to camelCase', () => {
        expect(camelCase("some_value_here")).toBe("someValueHere");
    });

    test('converts kebab-case to camelCase', () => {
        expect(camelCase("get-this-done")).toBe("getThisDone");
    });

    test('handles mixed separators (spaces, underscores, hyphens)', () => {
        expect(camelCase("one_two-three four")).toBe("oneTwoThreeFour");
    });

    test('ignores leading and trailing spaces', () => {
        expect(camelCase("   leading spaces  ")).toBe("leadingSpaces");
    });

    test('handles uppercase input', () => {
        expect(camelCase("MAKE IT WORK")).toBe("makeItWork");
    });

    test('returns empty string for empty input', () => {
        expect(camelCase("")).toBe("");
    });

    test('handles input with special characters', () => {
        expect(camelCase("hello@world!")).toBe("hello@world");
    });

    test('handles numeric and alphanumeric input', () => {
        expect(camelCase("convert 123 to words")).toBe("convert123ToWords");
        expect(camelCase("mix123Words")).toBe("mix123words");
    });

    test('handles repetitive separators', () => {
        expect(camelCase("----repeated---hyphens__and_spaces ")).toBe("repeatedHyphensAndSpaces");
    });

    test('converts dash-only input to empty string', () => {
        expect(camelCase("----")).toBe("");
    });

    test('preserves case for words after first word', () => {
        expect(camelCase("UPPER lowercase MixEd")).toBe("upperLowercaseMixed");
    });

});


describe("ellipsesInMiddle", () => {
    test("returns full string if within maxLength", () => {
        expect(ellipsesInMiddle("short", 10)).toBe("short");
    });

    test("truncates with default ellipses in the middle", () => {
        expect(ellipsesInMiddle("abcdefghijklmno", 11)).toBe("abcd...lmno");
    });

    test("truncates with custom ellipses", () => {
        expect(ellipsesInMiddle("abcdefghijklmno", 11, "[...]")).toBe("abc[...]mno");
    });

    test("returns only ellipsis if maxLength is too small", () => {
        expect(ellipsesInMiddle("abcdefghij", 4)).toBe("...");
        expect(ellipsesInMiddle("abcdefghij", 5, "[...]")).toBe("[...]");
    });

    test("handles edge cases with extremely small maxLength", () => {
        expect(ellipsesInMiddle("abcdefghij", 3)).toBe("...");
        expect(ellipsesInMiddle("abcdefghij", 2, "--")).toBe("--");
    });
});

