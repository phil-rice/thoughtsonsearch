# What is the work flow of a search?


There are two main places that control this
* CommonSearchSovereignPage
* DoTheSearching

## Immediate search

There are two p

The user types into the search bar
* The input's onChange method updates the gui state 
  * Managed by useGuiSearchQuery
  * Can be seen in the devmode under 'gui state'
* The CommonSearchSovereignPage is the page that shows the search bar
  * It has a useEffect that monitors the search query
  * When that changes it updates the immediate search state.
    * It either clears the results if the search query is empty 
    * or it uses the parser to update the immediate search filters

* DoTheSearching takes over
  * (This was provided by the index.tsx)
  * This monitors the immediate filters 
  * This is the place that orchestrates the rest of the search
    * An important part of this is the count. 
      * This is increased each time we search
      * When a search result comes back if the count has changed we don't do anything with it
      * This prevents race conditions
    * we call searchAllDataSourcesPage1 (sideeffect free in the sense it doesn't update state)
      * For each data source plugin we call it's fetch
        * That data source decides what or if to call
        * The data structure that comes back has a promise for each data source
    * We add 'thens' to the promises that 
      * Check the count hasn't updated
      * We might want to do other checksin the future like check major selection state hasn't changed
      * If appropriate update the state in 'results
    * All this state can be seen in devmode under 'search state'
  
* In CommonSearchSovereignPage we are displaying the SearchDropDown all the time
  * This monitors the search results for 'immediate'
  * If there are any we get the dropdown we expect


## Main search

* In the CommonSearchSovereignPage we display the search bar
* in the search bar we press the enter key or click the search button
  * This calls a 'callback' that is passed in from the parent
* The callback calls an optional callback passed into it by its parent
  * This is because different sovereign pages do different things on a main search: mostly selection state (initial search page becomes advanced search page)
  * It then sets the main filters (using a searchQueryParser)
* 
* DoTheSearching takes over as above
 
* The advanced sovereign page is the main place that shows results
* It just uses the 'SearchResults' component
  * This component monitors the search results for 'main'. 
  * This is not injected at the moment: it uses injected components to display
* The search results are ripped apart
  * We find two data structures:
    * Data type => Data[] (i.e. `jira:  [{type: jira, issue:...}], conflue...`)
    * Data source => errors in case we had some issues in the search
* We display the first data structure. 
  * Except when testing this will be by DefaultDisplaySearchResultDataType 
  * We know whether this should be displayed as a widget becuase of the selected data view
* DefaultDisplaySearchResultDataType
  * Uses the data type to find the data plugin
  * Uses either normal display or the widget display


## Why this structure
* Components are clean
* They just update a bit of state at the right time.
  * Easy to test for: we can test them without having to mock up any search results
  * Easy to understand
