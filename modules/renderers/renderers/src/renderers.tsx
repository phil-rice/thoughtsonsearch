import {makeContextFor} from "@enterprise_search/react_utils";

export function idFrom(rootId: string, attribute: string) {
    return `${rootId}-${attribute}`;
}

export type RenderProps = {
    rootId: string
    attribute: string
    value: string;
};
export type Render = (props: RenderProps) => React.ReactElement

export type RendererType = 'Text' | 'Html' | 'Markdown' | 'Json' | 'Date' | 'Url' | 'H1' | 'H2' | 'H3'
export type Renderers = Record<RendererType, Render>

export const {Provider: RenderProvider, use: useRenderers} = makeContextFor<Renderers, 'renderers'>('renderers')

