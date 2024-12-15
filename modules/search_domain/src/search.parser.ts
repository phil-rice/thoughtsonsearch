import {SearchState} from "./search.domain";

export type SearchParser = (from: SearchState) => SearchState

export function parseSearch(parser: SearchParser, from: SearchState): SearchParserResult {
    const searchState = parser(from)
    const remove = datasourceNamesToRemove(from, searchState)
    const add = datasourceNamesToAdd(from, searchState)
    return {parsedSearchState: searchState, remove, add}
}

export type SearchParserResult = {
    parsedSearchState: SearchState
    //datasourceNamesToRemove
    remove: string[]
    //datasourceNamesToAdd
    add: string[]
}

export function datasourceNamesToRemove(from: SearchState, to: SearchState) {
    return from.datasourceNames.filter(x => !to.datasourceNames.includes(x))
}

export function datasourceNamesToAdd(from: SearchState, to: SearchState) {
    return to.datasourceNames.filter(x => !from.datasourceNames.includes(x))
}

//the point of the search parser is to 'do things' to the strings and filters
//for example it can do spelling correction, it can do 'Phil in people' which will focus in on the data source people and have the keyword phil

//However the most basic search parser just copies queryString into the Query
export function simpleSearchParser({queryString, datasourceNames, query}: SearchState) {
    return {queryString, datasourceNames, query: {...query, keywords: queryString}};
}