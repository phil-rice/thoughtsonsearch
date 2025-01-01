import React from "react";
import ReactMarkdown from "react-markdown";
import {cleanForRender, CleanHeaders, Render} from "@enterprise_search/renderers";

export const MarkdownRenderer: Render = ({id, value}) => {
    return (
        <div id={`${id}-value`}>
            <CleanHeaders>
                <div data-testid={`${id}-markdown`}><ReactMarkdown>{cleanForRender(value || '')}</ReactMarkdown></div>
            </CleanHeaders>
        </div>
    );
};
