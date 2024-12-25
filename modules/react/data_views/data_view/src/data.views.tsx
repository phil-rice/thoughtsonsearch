import React from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor} from "@enterprise_search/react_utils";
import {CommonDataSourceDetails, DataSourceDetails} from "@enterprise_search/react_datasource_plugin";
import {useReportError} from "@enterprise_search/react_error";


export type DataViewDisplayProps = { itemName: string }
export type DataViewDisplay = (props: DataViewDisplayProps) => React.ReactElement;


export type DataViewPurposes = 'navbar'
export type DataViewPurposesToDisplay = Record<DataViewPurposes, DataViewDisplay>


export type DataViews<Details> = NameAnd<DataView<Details>>
export type DataView<Details> = {
    plugin: 'dataview'
    name: string
    displays: DataViewPurposesToDisplay
    datasources: Details[]
}

export type NavBarItemProps = { name: string, }
export type NavBarItem = (props: NavBarItemProps) => React.ReactElement;

export function dataSourceDetailsToDataView<Details extends CommonDataSourceDetails>(datasources: DataSourceDetails<Details>, ItemFn: NavBarItem): DataViews<Details> {
    const result: DataViews<Details> = {}
    for (const [name, datasource] of Object.entries(datasources)) {
        result[name] = {
            plugin: 'dataview',
            name,
            displays: {navbar: ({itemName}) => <ItemFn name={itemName}/>},
            datasources: datasource
        }
    }
    return result
}


export const {Provider: DataViewsProvider, use: useDataViews} = makeContextFor('dataViews', undefined as DataViews<CommonDataSourceDetails>)

export type DataViewNavVarLayoutProps = { children: React.ReactNode }
export type DataViewNavBarLayout = (props: DataViewNavVarLayoutProps) => React.ReactElement;
export type DataViewComponents = {
    NavBarLayout: DataViewNavBarLayout
    NavBarItem: NavBarItem
}
export const {Provider: DataViewComponentsProvider, use: useDataViewComponents} = makeContextFor('components', undefined as DataViewComponents)

export function DataViewNavBar() {
    const dataViews = useDataViews();
    const reportError = useReportError()
    const {NavBarLayout, NavBarItem} = useDataViewComponents();
    return <NavBarLayout>{Object.entries(dataViews).map(([key, dataView]) => {
        const NavItem = dataView.displays.navbar
        if (!NavItem) reportError('s/w', `No navbar display for data view ${key}`)
        return <NavBarItem key={key} name={key}/>
    })}</NavBarLayout>

}
