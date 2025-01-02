import React from "react";
import {cleanForRender, CleanHeaders, idFrom, Render} from "@enterprise_search/renderers";
import DOMPurify from "dompurify";


export const SimpleHtmlRenderer: Render = ({rootId, attribute, value}) => {
    const id = idFrom(rootId, attribute);
    const sanitizedHtml = DOMPurify.sanitize(cleanForRender(value || ''));
    return <CleanHeaders>
        <span id={id} data-testid={id} dangerouslySetInnerHTML={{__html: sanitizedHtml}}/>;
    </CleanHeaders>
};