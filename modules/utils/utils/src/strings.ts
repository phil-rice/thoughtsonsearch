/**
 * Converts a camelCase string to a series of words with the first letter capitalized.
 * Example: "thisText" => "This Text"
 *
 * @param input - The camelCase string to convert.
 * @returns The formatted string.
 */
export function camelCaseToWords(input: string): string {
    if (!input) return input
    return input
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before uppercase letters preceded by lowercase letters
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Handle sequences of uppercase letters
        .replace(/([a-zA-Z])([0-9])/g, '$1 $2') // Insert space before numbers following letters
        .replace(/([0-9])([a-zA-Z])/g, '$1 $2') // Insert space before letters following numbers
        .split(' ') // Split into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ') // Join words back into a string
        .trim(); // Trim leading and trailing spaces
}

export function camelCase(input: string): string {
    return input
        .replace(/[^a-zA-Z@0-9\s-_]/g, '')  // Remove special characters except spaces, hyphens, and underscores
        .toLowerCase()
        .split(/[\s-_]+/)  // Split by space, hyphen, or underscore
        .filter(x => x.trim().length > 0)
        .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
}




export function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}