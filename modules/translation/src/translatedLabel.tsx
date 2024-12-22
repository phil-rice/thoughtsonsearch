import React from "react";
import {useTranslation} from "./translation";

export type TranslatedLabelProps = {
    translationKey: string;
    htmlFor: string;

}
export const TranslatedLabel: React.FC<TranslatedLabelProps> = ({translationKey, htmlFor}) => {
    const translate = useTranslation();
    return <label htmlFor={htmlFor}>{translate(translationKey)}</label>;
};