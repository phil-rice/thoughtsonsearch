import {TranslationFn, TranslationProvider} from "@enterprise_search/translation";
import {pathToValue} from "@enterprise_search/recoil_utils";
import React, {ReactNode} from "react";
import {translationEn} from "./translation.en";

export function makeTranslationFn(translation: Record<string, any>): TranslationFn {
    return (key: string) => {
        return pathToValue(translation, key) || key + ' not found';
    }
}

type SimpleTranslationProps = { children: ReactNode, translation?: Record<string, any> }

export function SimpleTranslationProvider({children, translation = translationEn}: SimpleTranslationProps) {
    const translationFn = makeTranslationFn(translation);
    return <TranslationProvider value={translationFn}>{children}</TranslationProvider>;
}