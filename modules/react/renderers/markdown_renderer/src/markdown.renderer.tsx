import React from "react";
import ReactMarkdown from "react-markdown";
import {cleanForRender, CleanHeaders, Render} from "@enterprise_search/renderers";


export const MarkdownRenderer: Render = ({id, value}) => {
    return (
        <div id={`${id}-value`}>
            <CleanHeaders>
                <ReactMarkdown>{cleanForRender(value || '')}</ReactMarkdown>
            </CleanHeaders>
        </div>
    );
};
