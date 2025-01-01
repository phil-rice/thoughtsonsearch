import {SearchResultsComponents} from "./search.results.components";
import {SimpleErrorInDataSourceDev, SimpleErrorInDataSourceNormal} from "./simple.error.in.data.source";

export const simpleSearchResultComponents: SearchResultsComponents = {
    ErrorInDataSourceNormal: SimpleErrorInDataSourceNormal,
    ErrorInDataSourceDev: SimpleErrorInDataSourceDev
};