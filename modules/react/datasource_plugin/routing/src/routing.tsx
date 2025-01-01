import {GetterSetter, useDebug, useThrowError} from "@enterprise_search/react_utils";
import React, {Context, ReactElement, ReactNode, useContext, useMemo} from "react";
import {capitalizeFirstLetter} from "@enterprise_search/recoil_utils";
import {useWindowsPath, useWindowUrlData} from "./path.name.provider";

export const routingDebug = 'routing'

export type RoutingSegmentOps = GetterSetter<string>

export type RoutingContextResults = {
    use: () => RoutingSegmentOps
    Provider: (props: RoutingProviderProps) => ReactElement
    context: Context<RoutingSegmentOps | undefined>
}

type RoutingProviderProps = { children: ReactNode }


export function makeRoutingSegmentContextFor(
    field: string,
    segment: number
): RoutingContextResults {

    const context = React.createContext<RoutingSegmentOps | undefined>(undefined);

    function useRouting() {
        const debug = useDebug(routingDebug)
        const contextValue = useContext(context);
        const throwError = useThrowError();
        if (contextValue === undefined) {
            const upperedName = capitalizeFirstLetter(field);
            throwError('s/w', `use${upperedName} must be used within a ${upperedName}Provider`);
        }
        debug('useRouting', field, contextValue)
        return contextValue!;
    }

    // Provider component dynamically named like `${field}Provider`
    function RoutingProvider(props: RoutingProviderProps) {
        const debug = useDebug(routingDebug)
        const [urlData,setUrlData] = useWindowUrlData()
        const {parts, url} = urlData
        const value = parts[segment] || '';
        debug('RoutingProvider', segment, field, value)
        const ops: GetterSetter<string> = useMemo(() => [value, name => {
            const actualName = typeof name === 'function' ? name(value) : name
            const newParts = [...parts];
            newParts[segment] = actualName;
            const newUrl = new URL(url.toString());
            newUrl.pathname = `/${newParts.join('/')}`;  // bit dirty...
            debug('RoutingProvider', segment, actualName, 'pushState', newUrl.toString())
            window.history.pushState(null, '', newUrl.toString());
            setUrlData({...urlData,parts: newParts, url: newUrl})
        }], [value])
        return <context.Provider value={ops}>{props.children}</context.Provider>;
    }

    // Return context, hook, and provider with dynamic names
    return {use: useRouting, Provider: RoutingProvider, context};
}
