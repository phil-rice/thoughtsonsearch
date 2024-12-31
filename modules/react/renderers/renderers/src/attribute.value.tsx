import React, {createContext, ReactElement, useMemo} from "react";

import {mapRecord} from "@enterprise_search/recoil_utils";
import {Renderers, RendererType, RenderProvider} from "./renderers";
import {DataLayout} from "./data.layout";

export type AttributeValueLayoutProps = {
    children: [React.ReactNode, React.ReactNode];
}
export type AttributeValueLayout = (props: AttributeValueLayoutProps) => ReactElement

export type AttributeValueProps = {
    rootId: string
    attribute: string;
    value: string;
}
export type AttributeValue = (props: AttributeValueProps) => ReactElement
export type AttributeValueComponents = Record<RendererType, AttributeValue> & {
    DataLayout: DataLayout
}

type AttributeValueComponentsProviderProps = {
    children: React.ReactNode
    AttributeValueLayout: AttributeValueLayout
    DataLayout: DataLayout
    renderers: Renderers
}

export const AttributeValueContext = createContext<AttributeValueComponents | undefined>(undefined)

export function AttributeValueProvider({children, renderers, AttributeValueLayout, DataLayout}: AttributeValueComponentsProviderProps) {
    const components = useMemo(() => {
        const components = mapRecord(renderers, (Renderer) =>
            ({rootId, attribute, value}: AttributeValueProps) => {
                const id = `${rootId}-${attribute}=${value}`;
                return <AttributeValueLayout><label htmlFor={id}>{attribute}:&nbsp;</label><Renderer id={id} value={value}/></AttributeValueLayout>;
            }
        );
        return {...components, DataLayout}
    }, [renderers, AttributeValueLayout])
    return <AttributeValueContext.Provider value={components}>
        <RenderProvider renderers={renderers}>{children}</RenderProvider>
    </AttributeValueContext.Provider>
}

export function useAttributeValueComponents(): AttributeValueComponents {
    const components = React.useContext(AttributeValueContext);
    if (!components) throw new Error('useAttributeValueComponents must be used inside an AttributeValueProvider');
    return components;
}