import React, {Context, Dispatch, ReactElement, ReactNode, SetStateAction, useContext, useMemo, useState} from "react";
import {LensAndPath, lensBuilder, LensBuilder} from "@enterprise_search/optics";
import {makeGetterSetter} from "./make.getter.setter";
import {capitalizeFirstLetter} from "@enterprise_search/recoil_utils";
import {useReportError} from "@enterprise_search/react_error";

export type Setter<T> = Dispatch<SetStateAction<T>>
export type GetterSetter<T> = [T, Setter<T>]


export type ContextResults<Data, FIELD extends string> = {
    use: () => Data
    Provider: (props: { children: ReactNode } & Record<FIELD, Data>) => ReactElement
    context: Context<Data | undefined>
}

export function makeContextFor<Data, FIELD extends string>(
    field: FIELD,
    defaultValue?: Data
): ContextResults<Data, FIELD> {
    // Create the context dynamically
    const context = React.createContext<Data | undefined>(defaultValue);

    type ProviderProps = { children: ReactNode } & Record<FIELD, Data>;

    function useField() {
        const contextValue = useContext(context);
        const reportError = useReportError();
        if (contextValue === undefined) {
            const upperedName = capitalizeFirstLetter(field);
            reportError('s/w', `use${upperedName} must be used within a ${upperedName}Provider`);
        }
        return contextValue;
    }

    // Provider component dynamically named like `${field}Provider`
    function FIELDProvider(props: ProviderProps) {
        return <context.Provider value={props[field]}>{props.children}</context.Provider>;
    }

    // Return context, hook, and provider with dynamic names
    return {use: useField, Provider: FIELDProvider, context};
}

export type ContextResultsForState<Data, FIELD extends string> = {
    use: () => GetterSetter<Data>
    Provider: (props: { children: ReactNode } & Record<FIELD, Data>) => ReactNode
    context: Context<GetterSetter<Data> | undefined>
}

export function makeContextForState<Data, FIELD extends string>(field: FIELD): ContextResultsForState<Data, FIELD> {
    const Context = React.createContext<GetterSetter<Data> | undefined>(undefined);

    type ProviderProps = { children: ReactNode } & Record<FIELD, Data>;

    function useField() {
        const contextValue = useContext(Context);
        const reportError = useReportError();
        if (contextValue === undefined) {
            const fieldWithCap = capitalizeFirstLetter(field);
            reportError('s/w', `use${fieldWithCap} must be used within a ${fieldWithCap}Provider`);
        }
        return contextValue;
    }


    function FieldProvider(props: ProviderProps) {
        const getterSetter = useState<Data>(props[field]);
        return <Context.Provider value={getterSetter}>{props.children}</Context.Provider>;
    }

    return {use: useField, Provider: FieldProvider, context: Context};
}

export function makeUseStateChild<Data, Child>(
    parent: () => GetterSetter<Data>,
    lens: (id: LensBuilder<Data, Data>) => LensAndPath<Data, Child>
): () => GetterSetter<Child> {

    return () => {
        const [value, setValue] = parent(); // This is `useField()` behind the scenes
        return useMemo(() => {
            return makeGetterSetter(value, setValue, lens(lensBuilder()));
        }, [value, setValue, lens]); // lens might be stable or not, depends on usage
    };
}



