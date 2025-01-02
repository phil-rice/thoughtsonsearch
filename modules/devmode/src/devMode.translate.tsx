import React from "react";
import {useTranslationUsedAndNotFound} from "@enterprise_search/translation";
import {useAttributeValueComponents, useRenderers} from "@enterprise_search/renderers";

export function DevModeTranslate() {
    const ops = useTranslationUsedAndNotFound()
    const {DataLayout,Text,H1, Json} = useAttributeValueComponents()
    const rootId = 'dev-mode-translate'
    if (ops) {
        const {used,notFound,errors} = ops[0];
        return <DataLayout layout={[1,1,1]}>
            <Json rootId={rootId} attribute='devmode.Translate.used' value={JSON.stringify(used, null, 2)}/>
            <Json rootId={rootId} attribute='devmode.Translate.notFound' value={JSON.stringify(notFound, null, 2)}/>
            <Json rootId={rootId} attribute='devmode.Translate.errors' value={JSON.stringify(errors, null, 2)}/>
            </DataLayout>
    }
    return <p>'The TranslationUsedAndNotFoundProvider is not in used'</p>
}