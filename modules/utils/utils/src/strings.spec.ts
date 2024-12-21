import {camelCaseToWords} from "./strings";

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
