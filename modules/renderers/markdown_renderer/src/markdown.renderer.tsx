import React from "react";
import ReactMarkdown from "react-markdown";
import {cleanForRender, CleanHeaders, idFrom, Render} from "@enterprise_search/renderers";

export const MarkdownRenderer: Render = ({attribute,rootId, value}) => {
    const id =idFrom(rootId, attribute);
    return (
        <div id={id}>
            <CleanHeaders>
                <div data-testid={id}><ReactMarkdown>{cleanForRender(value || '')}</ReactMarkdown></div>
            </CleanHeaders>
        </div>
    );
};
