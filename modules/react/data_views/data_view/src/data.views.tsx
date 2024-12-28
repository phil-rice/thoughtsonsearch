import React, {SetStateAction, useCallback} from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {GetterSetter, makeContextFor, Setter, useDebug} from "@enterprise_search/react_utils";
import {CommonDataSourceDetails, DataSourceDetails} from "@enterprise_search/react_datasource_plugin";
import {makeSimpleNavBar, NavBar} from "@enterprise_search/navbar";
import {SearchGuiData, useGuiSelectedDataView, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {lensBuilder} from "@enterprise_search/optics";
import {DataViewFilterData, dataViewFilterName} from "@enterprise_search/react_data_views_filter_plugin";

export const dataViewDebug = 'dataView'

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


export type NavBarItemProps = { name: string, }
export type NavBarItem = (props: NavBarItemProps) => React.ReactElement;
export type DataViewNavVarLayoutProps = { children: React.ReactNode }
export type DataViewNavBarLayout = (props: DataViewNavVarLayoutProps) => React.ReactElement;
export type DataViewComponents = {
    DataViewNavbar: NavBar
}
export const {Provider: DataViewComponentsProvider, use: useDataViewComponents} = makeContextFor('components', undefined as DataViewComponents)

const dataViewL = lensBuilder<SearchGuiData<any>>().focusOn('filters').focusOn(dataViewFilterName)


export type DataViewNavBarProps = {}

export function DataViewNavBar(props: DataViewNavBarProps) {
    const debug = useDebug(dataViewDebug)
    const dataViews = useDataViews();
    const [selectedDataView, setSelectedDataView] = useGuiSelectedDataView();
    const [state, setState] = useSearchGuiState();
    debug ('Data views','selectedDataView', selectedDataView, 'dataViews', dataViews)
    const setSelected: Setter<string> = (name: SetStateAction<string>) => {
        const actualName = typeof name === 'string' ? name : name(selectedDataView)
        setSelectedDataView(actualName)
        const dataView: DataViewFilterData = {
            selected: actualName,
            selectedNames: [],
            allowedNames: dataViews[actualName].datasources.flatMap(ds => ds.names)
        }
        debug('Setting selected data view', actualName, dataView)
        setState(dataViewL.set(state, dataView))
    };
    const selectedOps: GetterSetter<string> = [selectedDataView, setSelected]
    const NavBar = useCallback(makeSimpleNavBar('Data views', Object.keys(dataViews)), [dataViews])
    return <NavBar selectedOps={selectedOps}/>
}

