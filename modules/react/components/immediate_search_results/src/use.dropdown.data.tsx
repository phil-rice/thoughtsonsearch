// Custom hook for transforming search results
import {DataAndDataSource, searchResultsToErrors, searchResultsToInterleavedData, SearchType} from "@enterprise_search/search_state";
import {useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {Errors} from "@enterprise_search/errors";

export const useDropdownData = (st: SearchType) => {
    const [searchResults] = useSearchResultsByStateType(st);
    const dataAndDs: DataAndDataSource<any>[] = searchResultsToInterleavedData(
        searchResults.dataSourceToSearchResult,
        6
    );
    const srToError: NameAnd<Errors> = searchResultsToErrors(searchResults.dataSourceToSearchResult);

    return {dataAndDs, srToError};
};