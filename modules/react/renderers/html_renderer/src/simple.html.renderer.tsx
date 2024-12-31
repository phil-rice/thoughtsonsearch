import React from "react";
import {Render} from "@enterprise_search/renderers";
import DOMPurify from "dompurify";
import {cleanForRender, CleanHeaders} from "@enterprise_search/renderers";


export const SimpleHtmlRenderer: Render = ({id, value}) => {
    const sanitizedHtml = DOMPurify.sanitize(cleanForRender(value || ''));
    return <CleanHeaders>
        <span id={`${id}-value`} dangerouslySetInnerHTML={{__html: sanitizedHtml}}/>;
    </CleanHeaders>
};