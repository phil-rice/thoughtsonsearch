import {createContext, useContext} from "react";
import {camelCaseToWords} from "@enterprise_search/recoil_utils";

export type TranslationFn = (key: string) => string;

// Default function to transform keys into readable labels
export const defaultTranslationFn: TranslationFn = camelCaseToWords;

// Context to provide and consume the current translation function
export const TranslationContext = createContext(defaultTranslationFn);

// Provider to allow translation code to be tested.
export const TranslationProvider = TranslationContext.Provider;

// Hook to retrieve the current translation function
export function useTranslation(): TranslationFn {
    return useContext(TranslationContext);
}


