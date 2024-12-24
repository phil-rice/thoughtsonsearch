

const allElasticSearchData = {type: 'elasticSearch', indicies: ['jira-prod', 'confluence-prod']}
const jiraElasicSearchData = {type: 'elasticSearch', indicies: ['jira-prod']}
const confluenceElasticSearchData = {type: 'elasticSearch', indicies: ['confluence-prod']}
const graphApiPeopleData = {type: 'graphApiPeople'}
const sharepointData = {type: 'sharepoint'}
const allDataSources = [allElasticSearchData, jiraElasicSearchData, confluenceElasticSearchData, graphApiPeopleData, sharepointData];

const someLayout = {
    start: {
        searchResult: 'start',
        dataSources: allDataSources
    },
    all: {
        searchResult: 'all',
        dataSources: allDataSources
    },
    jira: {
        searchResult: 'oneDataSource',
        dataSources: [jiraElasicSearchData]
    },
    confluence: {
        searchResult: 'oneDataSource',
        dataSources: [confluenceElasticSearchData]
    },
    graphApiPeople: {
        searchResult: 'oneDataSource',
        dataSources: [graphApiPeopleData]
    },
    sharepoint: {
        searchResult: 'oneDataSource',
        dataSources: [sharepointData]
    }
}
