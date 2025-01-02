import {RawTranslationFn, TranslationFn, TranslationProvider} from "@enterprise_search/translation";
import {pathToValue} from "@enterprise_search/recoil_utils";
import React, {ReactNode} from "react";
import {translationEn} from "./translation.en";

export function makeTranslationFn(translation: Record<string, any>): RawTranslationFn {
    return (key: string) => {
        return pathToValue(translation, key)
    }
}

type SimpleTranslationProps = { children: ReactNode, translation?: Record<string, any> }

export function SimpleTranslationProvider({children, translation = translationEn}: SimpleTranslationProps) {
    const translationFn = makeTranslationFn(translation);
    return <TranslationProvider translationFn={translationFn}>{children}</TranslationProvider>;
}