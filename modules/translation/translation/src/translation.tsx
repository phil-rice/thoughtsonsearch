import React, {createContext, useCallback, useContext} from "react";
import {camelCaseToWords} from "@enterprise_search/recoil_utils";
import {makeContextForState} from "@enterprise_search/react_utils";

export type RawTranslationFn = (key: string) => string | undefined;
export type TranslationFn = (key: string) => string;

// Default function to transform keys into readable labels
export const defaultTranslationFn: TranslationFn = camelCaseToWords;

export type UsedAndNotFound = {
    used: string[]
    notFound: string[]
    errors: string[]
}
export const {use: useTranslationUsedAndNotFound, Provider: TranslationUsedAndNotFoundProvider} = makeContextForState<UsedAndNotFound, 'usedAndNotFound'>('usedAndNotFound', true)


// Context to provide and consume the current translation function
export const TranslationContext = createContext<TranslationFn>(defaultTranslationFn);

export type TranslationProviderProps = {
    translationFn: RawTranslationFn

    defaultFn?: TranslationFn
    children: React.ReactNode
}

export function NotFoundTranslationFn(key: string): string {
    return key + '.not.found';
}


export function TranslationProvider({translationFn, children, defaultFn = NotFoundTranslationFn}: TranslationProviderProps) {
    const ops = useTranslationUsedAndNotFound();
    const translation: TranslationFn = useCallback((key: string) => {
        const translation = translationFn(key);
        if (ops) {
            const [usedAnd, setUsedAnd] = ops;
            const {used, errors, notFound} = usedAnd;
            if (translation === undefined) {
                if (notFound.indexOf(key) === -1)
                    setTimeout(() => setUsedAnd({...usedAnd, notFound: [...notFound, key]}), 0)
            } else {
                if (used.indexOf(key) === -1)
                    setTimeout(() => {
                        const result = {...usedAnd, used: [...used, key]};
                        setUsedAnd(result);
                    }, 0)
                if (typeof translation !== 'string' && errors.indexOf(key) === -1) {
                    setTimeout(() => setUsedAnd({...usedAnd, errors: [...errors, key]}), 0)
                }
            }
        }
        return translation ===undefined ? defaultFn(key): typeof translation === 'string' ? translation :  `${key}.error`

    }, [translationFn, defaultFn, ops || ''])
    return <TranslationContext.Provider value={translation}>{children}</TranslationContext.Provider>
}

export function useTranslation(): TranslationFn {
    return useContext(TranslationContext);
}
