import {AttributeValueProvider, Renderers, SimpleAttributeValueLayout, SimpleDataLayout, SimpleDateRenderer, SimpleH1Renderer, SimpleH2Renderer, SimpleH3Renderer, SimpleJsonRenderer, SimpleTextRenderer, SimpleUrlRenderer} from "@enterprise_search/renderers";
import {MarkdownRenderer} from "@enterprise_search/markdown_renderers";
import {SimpleHtmlRenderer} from "@enterprise_search/html_renderers";
import React from "react";

export const allRenderers: Renderers = {
    Text: SimpleTextRenderer,
    Markdown: MarkdownRenderer,
    Html: SimpleHtmlRenderer,
    Json: SimpleJsonRenderer,
    Date: SimpleDateRenderer,
    Url: SimpleUrlRenderer,
    H1: SimpleH1Renderer,
    H2: SimpleH2Renderer,
    H3: SimpleH3Renderer
}
type AllrenderersSimpleProviderProps = {
    children: React.ReactNode;
}

export function AllRenderersSimpleProvider({children}: AllrenderersSimpleProviderProps) {
    return <AttributeValueProvider renderers={allRenderers} AttributeValueLayout={SimpleAttributeValueLayout} DataLayout={SimpleDataLayout}>
        {children}
    </AttributeValueProvider>

}
