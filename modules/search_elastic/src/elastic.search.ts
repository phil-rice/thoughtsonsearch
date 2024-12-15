import {SearchTypeClass} from "@enterprise_search/search_domain";

type FileData = any
type ElasticSearchQuery = {
    body: any
}
type ElasticSearchResponse = {
    hits: { hits: FileData }
}
type ElasticSearchPage = undefined | {
    item: string//can't remember details. it's basically some data from the query
}

