import {debugLog} from "./debug";

describe('debugLog', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    });

    afterEach(() => {
        consoleSpy.mockRestore(); // Restore console.log after each test
    });

    it('logs messages in development environment', () => {
        process.env.NODE_ENV = 'development';
        debugLog('Test message', 42);

        expect(consoleSpy).toHaveBeenCalledWith('Test message', 42);
    });

    it('does not log messages in production environment', () => {
        process.env.NODE_ENV = 'production';
        debugLog('This should not be logged');

        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('handles undefined NODE_ENV as nothing', () => {
        delete process.env.NODE_ENV; // Simulate undefined NODE_ENV
        debugLog('Default to nothing');

        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('logs multiple arguments correctly', () => {
        process.env.NODE_ENV = 'development';
        debugLog('Test', {key: 'value'}, [1, 2, 3]);

        expect(consoleSpy).toHaveBeenCalledWith('Test', {key: 'value'}, [1, 2, 3]);
    });
});
