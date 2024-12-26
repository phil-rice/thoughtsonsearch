import {SearchResultsComponents} from "./search.results.components";
import {SimpleErrorInDataSourceDev, SimpleErrorInDataSourceNormal} from "./simpleErrorInDataSource";

export const simpleSearchResultComponents: SearchResultsComponents = {
    ErrorInDataSourceNormal: SimpleErrorInDataSourceNormal,
    ErrorInDataSourceDev: SimpleErrorInDataSourceDev
};