import React, {createContext, ReactElement, useMemo} from "react";
import {mapRecord} from "@enterprise_search/recoil_utils";
import {idFrom, Render, Renderers, RendererType, RenderProps, RenderProvider} from "./renderers";
import {DataLayout} from "./data.layout";
import {useTranslation} from "@enterprise_search/translation";

export type AttributeValueLayoutProps = {
    children: [React.ReactNode, React.ReactNode];
};
export type AttributeValueLayout = (props: AttributeValueLayoutProps) => ReactElement;

export type AttributeValueProps = {
    rootId: string;
    attribute: string;
    value: string;
};
export type AttributeValue = (props: AttributeValueProps) => ReactElement;

export type AttributeValueComponents = Record<RendererType, AttributeValue> & {
    DataLayout: DataLayout;
};

type AttributeValueComponentsProviderProps = {
    children: React.ReactNode;
    AttributeValueLayout: AttributeValueLayout;
    DataLayout: DataLayout;
    renderers: Renderers;
};

export const AttributeValueContext = createContext<AttributeValueComponents | undefined>(undefined);


type AttributeValueRendererProps = RenderProps & {
    Renderer: Render
    AttributeValueLayout: AttributeValueLayout;
}

function AttributeValueRenderer({Renderer, rootId, attribute, value, AttributeValueLayout}: AttributeValueRendererProps) {
    const id = idFrom(rootId, attribute);
    const translation = useTranslation();
    const label = translation(`${attribute}`);  // Internationalized label

    return (
        <AttributeValueLayout>
            <label htmlFor={id}>{label}:&nbsp;</label>
            <Renderer rootId={rootId} attribute={attribute} value={value || ""}/>
        </AttributeValueLayout>
    );
}

/**
 * Provides attribute-value rendering logic via context.
 * Enables injection of custom layouts and data layouts.
 */
export function AttributeValueProvider({
                                           children,
                                           renderers,
                                           AttributeValueLayout,
                                           DataLayout,
                                       }: AttributeValueComponentsProviderProps) {
    const components = useMemo(() => {
        const mappedComponents = mapRecord(renderers, (Renderer) =>
            (props: AttributeValueProps) =>
                <AttributeValueRenderer
                    Renderer={Renderer}
                    {...props}
                    AttributeValueLayout={AttributeValueLayout}
                />
        );

        return {...mappedComponents, DataLayout};
    }, [renderers, AttributeValueLayout]);

    return (
        <AttributeValueContext.Provider value={components}>
            <RenderProvider renderers={renderers}>{children}</RenderProvider>
        </AttributeValueContext.Provider>
    );
}

export function useAttributeValueComponents(): AttributeValueComponents {
    const components = React.useContext(AttributeValueContext);
    if (!components) throw new Error("useAttributeValueComponents must be used inside an AttributeValueProvider");
    return components;
}
