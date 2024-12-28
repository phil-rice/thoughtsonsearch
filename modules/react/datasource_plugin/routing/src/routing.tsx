import {GetterSetter, useDebug, useThrowError} from "@enterprise_search/react_utils";
import React, {Context, ReactElement, ReactNode, useContext, useMemo} from "react";
import {capitalizeFirstLetter} from "@enterprise_search/recoil_utils";
import {startStateDebug} from "@enterprise_search/search_important_components";

export const routingDebug = 'routing'

export type RoutingSegmentOps = GetterSetter<string>

export type RoutingContextResults = {
    use: () => RoutingSegmentOps
    Provider: (props: { children: ReactNode }) => ReactElement
    context: Context<RoutingSegmentOps | undefined>
}

export function makeRoutingSegmentContextFor(
    field: string,
    segment: number
): RoutingContextResults {

    const context = React.createContext<RoutingSegmentOps | undefined>(undefined);

    type ProviderProps = { children: ReactNode }

    function useRouting() {
        const debug = useDebug(routingDebug)
        const contextValue = useContext(context);
        const throwError = useThrowError();
        if (contextValue === undefined) {
            const upperedName = capitalizeFirstLetter(field);
            throwError('s/w', `use${upperedName} must be used within a ${upperedName}Provider`);
        }
        console.log('useRouting', field, contextValue)
        return contextValue!;
    }

    // Provider component dynamically named like `${field}Provider`
    function RoutingProvider(props: ProviderProps) {
        const debug = useDebug(startStateDebug)
        const rDebug = useDebug(routingDebug)
        const url = new URL(window.location.href)
        const parts = url.pathname.split('/').filter(Boolean);
        const value = parts[segment] || '';
        const [stored, setStored] = React.useState(value)

        debug('RoutingProvider', segment, field, value)
        rDebug('RoutingProvider', segment, field, value)
        const ops: GetterSetter<string> = useMemo(() => [stored, name => {
            const url = new URL(window.location.href)
            const actualName = typeof name === 'function' ? name(value) : name
            const newParts = [...parts];
            newParts[segment] = actualName;
            url.pathname = `/${newParts.join('/')}`;
            rDebug('RoutingProvider', segment, actualName, 'pushState', url.toString())
            setStored(actualName)
            window.history.pushState(null, '', url.toString());
        }], [value])
        return <context.Provider value={ops}>{props.children}</context.Provider>;
    }

    // Return context, hook, and provider with dynamic names
    return {use: useRouting, Provider: RoutingProvider, context};
}

// export const {use: useRouting0, Provider: RoutingProvider0} = makeRoutingSegmentContextFor('routing0', 0)
//
// export const {use: useRouting1, Provider: RoutingProvider1} = makeRoutingSegmentContextFor('routing1', 1)