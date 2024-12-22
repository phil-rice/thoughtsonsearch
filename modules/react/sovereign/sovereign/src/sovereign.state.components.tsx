import React, {ReactElement, ReactNode, useMemo} from "react";


import {NameAnd} from "@enterprise_search/recoil_utils";
import {useSelectSovereign} from "./sovereign.state.context";

export type SovereignDisplayProps = {}
export type SovereignDisplay = (props: SovereignDisplayProps) => React.ReactElement;
export type SovereignDisplays = NameAnd<SovereignDisplay>

export type DisplayCurrentSovereignProps = {}
export type DisplayCurrentSovereign = (props: DisplayCurrentSovereignProps) => React.ReactElement;

export type SovereignStateBarProps = {}
export type SovereignStateBar = (props: SovereignStateBarProps) => React.ReactElement;

export type SovereignStateBarLayoutProps = { children: ReactNode }
export type SovereignStateBarLayout = (props: SovereignStateBarLayoutProps) => React.ReactElement;

export type SovereignBarItemProps = {}
export type SovereignBarItem = (props: SovereignBarItemProps) => React.ReactElement;
export type SovereignBarItems = NameAnd<SovereignBarItem>

export type SovereignComponents = {
    SovereignDisplays: SovereignDisplays
    DisplayCurrentSovereign: DisplayCurrentSovereign
    SovereignStateBar: SovereignStateBar
    SovereignStateBarLayout: SovereignStateBarLayout
    SovereignBarItems: SovereignBarItems
}

export const SovereignComponentsContext = React.createContext<SovereignComponents | undefined>(undefined)

export type SovereignComponentsProviderProps = {
    children: React.ReactNode
    SovereignDisplays: SovereignDisplays
    DisplayCurrentSovereign?: DisplayCurrentSovereign
    SovereignStateBar?: SovereignStateBar
    SovereignStateBarLayout?: SovereignStateBarLayout
    SovereignBarItems: SovereignBarItems
}

export function SovereignComponentsProvider({
                                                SovereignDisplays,
                                                DisplayCurrentSovereign = SimpleDisplayCurrentSovereign,
                                                SovereignStateBar = SimpleSovereignStateBar,
                                                SovereignStateBarLayout = SimpleSovereignStateBarLayout,
                                                SovereignBarItems,
                                                children,
                                            }: SovereignComponentsProviderProps) {
    const data = useMemo(() => ({
        SovereignDisplays,
        DisplayCurrentSovereign,
        SovereignStateBar,
        SovereignStateBarLayout,
        SovereignBarItems
    }), [SovereignDisplays, DisplayCurrentSovereign, SovereignStateBar, SovereignStateBarLayout, SovereignBarItems])
    return <SovereignComponentsContext.Provider value={data}>
        {children}
    </SovereignComponentsContext.Provider>
}

export function useSovereignComponents(): SovereignComponents {
    const context = React.useContext(SovereignComponentsContext);
    if (!context) throw new Error("useSovereignComponents must be used within a SovereignComponentsProvider");
    return context;
}

export const SimpleSovereignStateBarLayout: SovereignStateBarLayout = ({children}) => {
    return <div className='sovereign'>{children}</div>
}

export const SimpleSovereignStateBar: SovereignStateBar = () => {
    const {SovereignBarItems, SovereignStateBarLayout} = useSovereignComponents()
    return <SovereignStateBarLayout>{SovereignBarItems.map((Item, index) => <Item key={index}/>)}</SovereignStateBarLayout>
}

export const SimpleDisplayCurrentSovereign: DisplayCurrentSovereign = <SovereignState, >(props): ReactElement => {
    const {SovereignDisplays} = useSovereignComponents()
    const [selectedSovereign] = useSelectSovereign<SovereignState>()
    const SovereignDisplay = SovereignDisplays[selectedSovereign as string] || SovereignDisplays[Object.keys(SovereignDisplays)[0]]
    return <SovereignDisplay {...props} />
};
