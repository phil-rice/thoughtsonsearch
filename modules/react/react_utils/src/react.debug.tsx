import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextForState} from "./react_utils";
import {useCallback, useMemo} from "react";


export type DebugState = NameAnd<boolean>

export const {use: useDebugState, Provider: DebugStateProvider} = makeContextForState<DebugState, 'debugState'>('debugState')

export type DebugLog = DebugLogFn & {
    debug: boolean,
    debugError: DebugErrorFn
}

export type DebugLogFn = (...msg: any[]) => void;
export type DebugErrorFn = (error: Error, ...msg: any[]) => void;

function createDebugLog(
    name: string,
    debug: boolean
): DebugLogFn & { debug: boolean, debugError: DebugErrorFn } {
    const log: DebugLogFn = (...msg: any[]) => {
        if (debug) console.log(name, ...msg);
    };

    const error: DebugErrorFn = (error: Error, ...msg: any[]) => {
        if (debug) console.error(`[ERROR] ${name}`, error, ...msg);
    };

    return Object.assign(log, {
        debug,
        debugError: error
    });
}

export function useDebug(name: string): DebugLog {
    const [debugState] = useDebugState();
    const debug = debugState[name] ?? false;
    return useMemo<DebugLog>(() => createDebugLog(name, debug), [debug, name]);
}

export function createMockDebugLog(): DebugLog {
    const logFn: DebugLog = Object.assign(
        jest.fn() as unknown as DebugLog,  // Type assertion to satisfy DebugLogFn
        {
            debug: true,
            debugError: jest.fn(),  // Mock for error logging
        }
    );
    return logFn;
}