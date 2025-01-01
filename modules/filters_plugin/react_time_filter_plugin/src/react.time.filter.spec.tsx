// Mock Debug Logger
import {makeWindowUrlData} from "@enterprise_search/routing";
import {exampleTimeFilterPlugin} from "./react.time.filter";

const mockDebug = jest.fn();

describe('exampleTimeFilterPlugin', () => {
    beforeEach(() => {
        mockDebug.mockClear();
    });

    describe('fromUrl', () => {
        it('extracts time filter from URL if present', () => {
            const urlData = makeWindowUrlData('https://example.com?time=last24hours');
            const result = exampleTimeFilterPlugin.fromUrl!(mockDebug as any, urlData, 'default-time');

            expect(result).toBe('last24hours');
            expect(mockDebug).toHaveBeenCalledWith(
                'timeFilter fromUrl',
                'time=',
                'last24hours'
            );
        });

        it('returns default time if URL parameter is missing', () => {
            const urlData = makeWindowUrlData('https://example.com');
            const result = exampleTimeFilterPlugin.fromUrl!(mockDebug as any, urlData, 'default-time');

            expect(result).toBe('default-time');
            expect(mockDebug).toHaveBeenCalledWith(
                'timeFilter fromUrl',
                'time=',
                null
            );
        });
    });

    describe('addToUrl', () => {
        it('adds time filter to URLSearchParams if present', () => {
            const params = new URLSearchParams();
            exampleTimeFilterPlugin.addToUrl!(mockDebug as any, params, 'last7days');

            expect(params.get('time')).toBe('last7days');
            expect(mockDebug).toHaveBeenCalledWith(
                'timeFilter addToUrl',
                'time=',
                'last7days'
            );
        });

        it('removes time filter from URLSearchParams if empty', () => {
            const params = new URLSearchParams({time: 'yesterday'});
            exampleTimeFilterPlugin.addToUrl!(mockDebug as any, params, '');

            expect(params.get('time')).toBeNull();
            expect(mockDebug).toHaveBeenCalledWith(
                'timeFilter addToUrl',
                'time=',
                ''
            );
        });
    });
});
