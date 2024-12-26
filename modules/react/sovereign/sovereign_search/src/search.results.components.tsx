import React, {ReactElement} from "react";
import {makeContextFor} from "@enterprise_search/react_utils";
import {useUserData} from "@enterprise_search/authentication";
import {Errors} from "@enterprise_search/errors";

export type SearchResultsComponents = {
    ErrorInDataSourceDev: ErrorInDataSource
    ErrorInDataSourceNormal: ErrorInDataSource
}
export const {use: useSearchResultsComponents, Provider: SearchResultsComponentsProvider} = makeContextFor<SearchResultsComponents, 'searchResultsComponents'>('searchResultsComponents')


export type ErrorInDataSourceProps = {
    dataSourceName: string
    errors: Errors
}
export type ErrorInDataSource = (props: ErrorInDataSourceProps) => ReactElement

export const ErrorInDataSource: ErrorInDataSource = (props: ErrorInDataSourceProps) => {
    const devMode = useUserData().isDev
    const {ErrorInDataSourceDev, ErrorInDataSourceNormal} = useSearchResultsComponents()
    return devMode ? <ErrorInDataSourceDev {...props}/> : <ErrorInDataSourceNormal {...props} />
}


