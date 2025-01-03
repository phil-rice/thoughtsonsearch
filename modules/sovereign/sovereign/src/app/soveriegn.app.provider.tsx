import {WindowUrlProvider} from "@enterprise_search/routing";
import {emptyUsedAndNotFound, TranslationUsedAndNotFoundProvider} from "@enterprise_search/translation";
import {SimpleTranslationProvider} from "@enterprise_search/simple_translation";
import {AttributeValueLayout, AttributeValueProvider, DataLayout, Renderers, SimpleAttributeValueLayout} from "@enterprise_search/renderers";
import {allRenderers} from "@enterprise_search/all_renderers";
import {ErrorReporter, FeatureFlags, NonFunctionalsProvider} from "@enterprise_search/react_utils";
import {AuthenticationProvider, LoginConfig} from "@enterprise_search/react_login_component";
import {SovereignStatePluginsProvider, SovereignStateProvider} from "../sovereign.selection.state";
import {IconContextData, IconProvider, simpleIconContext} from "@enterprise_search/icons";
import React, {ReactNode} from "react";
import {DebugState} from "@enterprise_search/recoil_utils";
import {SovereignAppComponents, SovereignAppComponentsProvider} from "./sovereign.app.components";

import {SelectableButton, SelectableButtonProvider} from "@enterprise_search/selectable_button";

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
    SelectableButton: SelectableButton
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
        SelectableButton,
        sovAppComponents,
        children,
    }: SovereignAppProviderProps
) {
    return <WindowUrlProvider>
        <TranslationUsedAndNotFoundProvider usedAndNotFound={emptyUsedAndNotFound()}>
            <SimpleTranslationProvider>
                <SelectableButtonProvider selectableButton={SelectableButton}>
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
                </SelectableButtonProvider>
            </SimpleTranslationProvider>
        </TranslationUsedAndNotFoundProvider>
    </WindowUrlProvider>
}