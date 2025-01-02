import {WindowUrlProvider} from "@enterprise_search/routing";
import {emptyUsedAndNotFound, TranslationUsedAndNotFoundProvider} from "@enterprise_search/translation";
import {SimpleTranslationProvider} from "@enterprise_search/simple_translation";
import {AttributeValueLayout, AttributeValueProvider, Renderers, SimpleAttributeValueLayout, SimpleDataLayout} from "@enterprise_search/renderers";
import {allRenderers} from "@enterprise_search/all_renderers";
import {consoleErrorReporter, ErrorReporter, FeatureFlags, NonFunctionalsProvider} from "@enterprise_search/react_utils";
import {AuthenticationProvider, LoginConfig} from "@enterprise_search/react_login_component";
import {SovereignStatePluginsProvider, SovereignStateProvider} from "../sovereign.selection.state";
import {SearchImportantComponentsProvider} from "@enterprise_search/search_important_components";
import {IconContextData, IconProvider, simpleIconContext} from "@enterprise_search/icons";
import {DoTheSearching} from "@enterprise_search/search";
import React, {ReactNode} from "react";
import {DebugState} from "@enterprise_search/recoil_utils";
import {DataLayout} from "@enterprise_search/renderers/src/data.layout";
import {SovereignAppComponents, SovereignAppComponentsProvider} from "./sovereign.app.components";

export type SovereignAppProviderProps = {
    login: LoginConfig
    errorReporter: ErrorReporter,
    debugState: DebugState
    sovereignStatePlugins: any
    featureFlags: FeatureFlags
    dataLayout: DataLayout
    attributeValueLayout?: AttributeValueLayout
    renderers?: Renderers
    icons?: IconContextData
    sovAppComponents: SovereignAppComponents
    children: ReactNode
}

export function SovereignAppProvider(
    {
        errorReporter,
        debugState, sovereignStatePlugins, featureFlags, login,
        dataLayout,
        renderers = allRenderers,
        icons = simpleIconContext,
        attributeValueLayout = SimpleAttributeValueLayout,
        sovAppComponents,
        children,
    }: SovereignAppProviderProps
) {
    return <WindowUrlProvider>
        <TranslationUsedAndNotFoundProvider usedAndNotFound={emptyUsedAndNotFound()}>
            <SimpleTranslationProvider>
                <AttributeValueProvider renderers={renderers} AttributeValueLayout={attributeValueLayout} DataLayout={dataLayout}>
                    <NonFunctionalsProvider debugState={debugState} featureFlags={featureFlags} errorReporter={errorReporter}>
                        <AuthenticationProvider loginConfig={login}>
                            <SovereignStatePluginsProvider plugins={sovereignStatePlugins}>
                                <SovereignStateProvider>
                                    <IconProvider icons={icons}>
                                        <SovereignAppComponentsProvider sovereignAppComponents={sovAppComponents}>
                                            {children}
                                        </SovereignAppComponentsProvider>
                                    </IconProvider>

                                </SovereignStateProvider>
                            </SovereignStatePluginsProvider>
                        </AuthenticationProvider>
                    </NonFunctionalsProvider>
                </AttributeValueProvider>
            </SimpleTranslationProvider>
        </TranslationUsedAndNotFoundProvider>
    </WindowUrlProvider>
}