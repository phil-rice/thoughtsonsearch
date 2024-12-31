import {makeContextFor} from "@enterprise_search/react_utils";

export type RenderProps = {
    id: string;
    value: string;
};
export type Render = (props: RenderProps) => React.ReactElement

export type RendererType = 'Text' | 'Html' | 'Markdown' | 'Json' | 'Date' |'Url'
export type Renderers = Record<RendererType, Render>

export const {Provider: RenderProvider, use: useRenderers} = makeContextFor<Renderers, 'renderers'>('renderers')

