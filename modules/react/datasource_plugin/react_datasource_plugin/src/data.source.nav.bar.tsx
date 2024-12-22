import {useDataSourcePlugins} from "./react.data.source.plugin";
import React, {createContext} from "react";
import {DataSourceAllButton} from "./data.source.buttons";

export type DataSourceNavBarComponents = {
    DataSourceNavBarLayout: DataSourceNavBarLayout
    DataSourceAllButton: DataSourceAllButton
}

export type DataSourceNavBarLayoutProps = {
    children: React.ReactNode
}

export type DataSourceNavBarLayout = (props: DataSourceNavBarLayoutProps) => React.ReactElement

export function useDataSourceNavBarComponents(): DataSourceNavBarComponents {
    const context = React.useContext(DataSourceNavBarLayoutContext)
    if (context === undefined) throw new Error('useDataSourceNavBarComponents must be used within a DataSourceNavBarLayoutProvider');
    return context
}

export const DataSourceNavBarLayoutContext = createContext<DataSourceNavBarComponents | undefined>(undefined)

export type DataSourceNavBarLayoutProviderProps = {
    components: DataSourceNavBarComponents
    children: React.ReactNode
}

export function DataSourceNavBarLayoutProvider({children, components}: DataSourceNavBarLayoutProviderProps) {
    return <DataSourceNavBarLayoutContext.Provider value={components}>{children}</DataSourceNavBarLayoutContext.Provider>
}

export function SimpleDataSourceNavBarLayout({children}: DataSourceNavBarLayoutProps) {
    const {DataSourceAllButton} = useDataSourceNavBarComponents()
    return <div className='data-source-nav-bar'>{children}</div>
}


export function DataSourceNavBar() {
    const {DataSourceNavBarLayout, DataSourceAllButton} = useDataSourceNavBarComponents()
    const plugins = useDataSourcePlugins()
    return <DataSourceNavBarLayout>
        <DataSourceAllButton/>
        {Object.values(plugins).map((plugin) => plugin.navBar())}
    </DataSourceNavBarLayout>
}

