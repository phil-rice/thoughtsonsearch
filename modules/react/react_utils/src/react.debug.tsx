import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextForState} from "./react_utils";

export type DebugState = NameAnd<boolean>;

export const {use: useDebugState, Provider: DebugStateProvider} = makeContextForState<
    DebugState,
    "debugState"
>("debugState");

export type DebugLog = DebugLogFn & {
    debug: boolean;
    debugError: DebugErrorFn;
};


export type DebugLogFn = (...msg: any[]) => void;
export type DebugErrorFn = (error: Error, ...msg: any[]) => void;

export function makeDebugLog(debugState: DebugState, name: string) :DebugLog{
    const debug = debugState[name] ?? false;
    if (debug) {
        const debugLog = console.log.bind(console, name);  // Attach component name to logs

        const error: DebugErrorFn = (error: Error, ...msg: any[]) => {
            if (debug) {
                console.error(`[ERROR] ${name}`, error, ...msg);
            }
        };

        return Object.assign(debugLog, {
            debug,
            debugError: error,
        });
    } else {
        const debugLog = () => {};
        const error = () => {};
        return Object.assign(debugLog, {
            debug,
            debugError: error,
        });
    }
}

export function useDebug(name: string): DebugLog {
    const [debugState] = useDebugState();
    return makeDebugLog(debugState, name);
}

export function createMockDebugLog(): DebugLog {
    const mockLog = jest.fn();
    const mockError = jest.fn();
    return Object.assign(mockLog, {
        debug: true,
        debugError: mockError,
    });
}
