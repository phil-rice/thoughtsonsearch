Review of this log https://chatgpt.com/share/6767b9fe-3e08-8013-bdfc-9cb6e1e81e6c

# Many small packages in a mono repo

Large applications should be built of small composable components. This allows us to think about each of the
components in isolation. Having a npm package structure forces us to decide about the interactions between things
and gives us clear boundaries. It is in a mono repo because otherwise repo management becomes a nightmare.

# Use of typescript

Typescript is a superset of javascript that allows us to write strongly typed code. This allows us to catch errors much
earlier. It also allows us to express our intent more clearly. Typescript gives great access to modern javascript
features.
There is a lot of advanced types in this codebase: fortunately modern AI tools can help explain what these mean. These
are typically in 'library' code allowing the use of the library to throw compilation errors if not used properly. See
the optics package for an example

# Use of React

Mandated by the customer. But in addition it is in the opinion of the author that react is a great way to build UIs.

# Decoupling of state management

While React is great for rendering components and declaratively asserting what should be on the screen it is very weak
in state management. There are tools to help: the useState hook, the contexts, but these quickly become unwieldy. Redux
is not a desirable solution: it breaks cohesion: smearing the intent in a lot of places, it is object-oriented and thus
always clunky when interacting with the functional Redux. Refactoring and understanding large redux programs is in
the opinion of the author frankly a nightmare.

Now facebook have brought our recoil which is actually very nice. But it is volatile and not yet mature. I have decided
to decouple our code from it. To make it so that we change the state management. This is in line with best practices
such
as program against interfaces not implementations.

## Custom hooks

I provide custom hooks for many parts of the state. See the package react_search_state for examples:

```typescript jsx
export type Setter<T> = Dispatch<SetStateAction<T>>
export type GetterSetter<T> = [T, Setter<T>]

export type SearchStateOps<Filters> = GetterSetter<SearchState<Filters>>
```

We can thus use

```typescript jsx
const [searchState, setSearchState] = useSearchState<Filters>(initialState)
```

And we have no idea how the state is actually managed: we can change it at any time. This allows us to change the recoil
version or move to redux or whatever we want. I have actually implemented these using useState for now anyway: this
makes
the application re-render more than it needs to, but it demonstrates the decoupling

## Use of optics in state management

Just wow in the simplicity of use. Example

```typescript jsx       
const searchsL = lensBuilder<SearchState<any>>().focusOn('searches');
const searchQueryL = lensBuilder<SearchState<any>>().focusOn('searchQuery');

const [searchState, setSearchState] = React.useState<SearchState<Filters>>(initialSearchState);
const searchStateOps: SearchStateOps<Filters> = [searchState, setSearchState]
const searchQueryOps: SearchQueryOps = makeGetterSetter(searchState, setSearchState, searchQueryL)
const allSearchInfoOps: AllSearchesOps<Filters> = makeGetterSetter(searchState, setSearchState, searchsL)
const filtersAndResultOps: OneSearchOpsFn<Filters> = useCallback<OneSearchOpsFn<Filters>>(
    (t: SearchType): OneSearchOps<Filters> => makeGetterSetter(searchState, setSearchState, searchsL.focusOn(t)), [searchState, setSearchState]);

const filtersOps: FiltersOpFn<Filters> = useCallback<FiltersOpFn<Filters>>(
    (t: SearchType): FiltersOps<Filters> =>
        makeGetterSetter(searchState, setSearchState, searchsL.focusOn(t).focusOn('filters')), [searchState, setSearchState]);

const oneFilterOps: OneFilterOpsStateAndNameFn<Filters> = useCallback<OneFilterOpsStateAndNameFn<Filters>>(
    <FilterName extends keyof Filters>(st: SearchType, filterName: FilterName) =>
        makeGetterSetter(searchState, setSearchState, searchsL.focusOn(st).focusOn('filters').focusOn<FilterName>(filterName)), [searchState, setSearchState]);

const contextData: SearchStateContextData<Filters> = {
    searchStateOps,
    searchQueryOps,
    allSearchInfoOps,
    filtersAndResultOps,
    filtersOps,
    oneFilterOps
};
return <SearchStateProvider ops={contextData}>{children}</SearchStateProvider>;
```

It's worth comparing the simplicity, readability, decoupling, reusability and testability of this code to the
alternatives
which I wrote first. Can you see if there is a bug in this? What is the impact when we change the state structure (which
we are doing a lot at the moment)?

```typescript jsx   
export const SearchInfoProviderUsingUseState = <Filters, >({
                                                               allSearchState: initialSearchState,
                                                               children
                                                           }: SearchStateUsingStateProvider<Filters>) => {
    const [searchState, setSearchState] = React.useState<SearchState<Filters>>(initialSearchState);

    const searchStateOps: SearchStateOps<Filters> = {searchState, setSearchState}
    const searchQueryOps: SearchQueryOps = {
        searchQuery: searchState.searchQuery,
        setSearchQuery: (searchQuery: string) => setSearchState({...searchState, searchQuery})
    }
    const allSearchInfoOps: AllSearchesOps<Filters> = {
        allSearches: searchState.searches,
        setAllSearches: (allSearchInfo: AllSearches<Filters>) => setSearchState({
            ...searchState,
            searches: allSearchInfo
        })
    };

    const filtersAndResultOps: OneSearchOpsFn<Filters> = useCallback<OneSearchOpsFn<Filters>>(
        (t: SearchType): OneSearchOps<Filters> => {
            return {
                filtersAndResult: searchState.searches[t],
                setFiltersAndResult: (filtersAndResult: OneSearch<Filters>) => setSearchState({
                    ...searchState,
                    searches: {...searchState.searches, [t]: filtersAndResult}
                })
            }
        }, [searchState, setSearchState]);

    const filtersOps: FiltersOpFn<Filters> = useCallback<FiltersOpFn<Filters>>(
        (t: SearchType): FiltersOps<Filters> => {
            return {
                filters: searchState.searches[t].filters,
                setFilters: (filters: Filters) => setSearchState({
                    ...searchState,
                    searches: {
                        ...searchState.searches,
                        [t]: {...searchState.searches[t], filters}
                    }
                })
            }
        }, [searchState, setSearchState]);
    const oneFilterOps: OneFilterOpsStateAndNameFn<Filters> = useCallback<OneFilterOpsStateAndNameFn<Filters>>(
        <FilterName extends keyof Filters>(st: SearchType, filterName: FilterName) => {
            return {
                filterName,
                filter: searchState.searches[st].filters[filterName],
                setFilter: (filter: Filters[keyof Filters]) => setSearchState({
                    ...searchState,
                    searches: {
                        ...searchState.searches,
                        [st]: {
                            ...searchState.searches[st],
                            filters: {...searchState.searches[st].filters, [filterName]: filter}
                        }
                    }
                })
            }
        }, [searchState, setSearchState]);

    const contextData: SearchStateContextData<Filters> = {
        searchStateOps,
        searchQueryOps,
        allSearchInfoOps,
        filtersAndResultOps,
        filtersOps,
        oneFilterOps
    };
    return <SearchStateProvider ops={contextData}>{children}</SearchStateProvider>;
}
``` 

However, optics are not used in most of the code because with the custom hooks we have hidden them.

They are useful when we have complex state to mutate. So mostly in the search state management.

## Comment on the useCallback in the state management

Note the heavy use of useCallback. Without them, we would be probably re-rendering the whole application every time the
state changes.
This is extremely subtle, extremely easy to mess up, and we need to constantly be checking.

# Separation of concerns in the state

We have a number of types of state

* The state of the search. This should ideally be simple json primitives. No functions here.
    * This allows us to serialize the state easily for display on the gui or in the logs
    * It reads good when debugging
    * It works well with re-rendering: react knows how to handle these and there are no pains around useCallback or
      useMemo
* The state of selection that we want to be able to bookmark
      * This is kept in sync with the windows url. At the moment the code to do this is messy, and needs some thought 
      * This is accessed via custom hooks
* The state of selection locally in the app
      * This is mostly done with useState. 
      * It's OK to do a single level of prop drilling, although that should be avoided if possible
      * More than a single level and we should consider our options. This hasn't happened yet
* How do I display this component
    * This is handled through custom hooks NOT the explicit implementation.
    * We program against interfaces not implementations
    * This is handled through the context api.
* Context such as 'what are my plugins'
    * This is handled through the context api.

# Display components accessed through hooks not directly

## Drivers

* We want to be able to white label this. This means that we need to be able to change the display of the components
    * Some of this can be css, but that is often painful to get right. The css grows and becomes too hard for humans to
      understand
    * Not all of it is css. We might have different components and the logic might change in minor ways
* We want to be able to change the framework we use to display the components
    * For example, we might want to use 'react native' for mobile.
    * Companies change their 'preferred library' constantly (say every 5 years). We want this to be easy for us
    * Versions have breaking changes. This layer makes it much easier to swap in the old and new to compare the
      differences (it can be a feature flag, and that is almost impossible with this)
* We want to have feature flags and have the 'old' and 'new' running at the same time. Even for high impacting changes
    * This is a very common use case. We want to be able to compare the two easily
    * We want to be able to switch between the two easily
* We want A/B testing
* We want to be able to add in higher order things such as profiling and metrics easily without changing the code

## Cost

There is no free lunch. The benefits are enormous but come at a cost. The cost is that common to dependency injection.
We can no longer 'click' on a component and see how it is used. We have mitigation strategies for this. The most
important is the 'important components'. This is an extra layer and the decisions for why that come next

## How

There are three or four moving parts

* We declare the component interface / context and custom hooks
* We implement the component
* We use the component
* We 'dependency inject' the component using 'important components'.
  * At the moment we only have 'search important components'
  * We probably want to look at this and make it a 'sovereign provider'

### Declare the component interface / context and custom hooks

```typescript jsx
export type SearchBarProps = {}
export type SearchBar = (props: SearchBarProps) => React.ReactElement

export const SearchContext = createContext<SearchBar | undefined>(undefined)

export type SearchBarProviderProps = {
    SearchBar: SearchBar
    children: React.ReactNode
}
export const SearchBarProvider = ({SearchBar, children}: SearchBarProviderProps) => {
    return <SearchContext.Provider value={SearchBar}>{children}</SearchContext.Provider>
}

export const useSearchBar = () => {
    const SearchBar = React.useContext(SearchContext)
    if (!SearchBar) throw new Error("useSearchBar must be used within a SearchContextProvider")
    return {SearchBar}
}
```

### Implement the component

Just like normal. I often use a simple prefix if the component doesn't use a gui framework, but would prefix with a gui
framework if it did.

```typescript jsx
export const SimpleSearchBar: SearchBar = (props) => {
    return <div>Search Bar</div>
}
export const MuiSimpleSearchBar: SearchBar = (props) => {
    return <Paper>Search Bar</Paper>
}
```

### Use the component

This is the bit that decouples the component from the implementation. We can change the implementation without changing
anything.
Note that here we should have zero css. We can have class names but either really simple layout, or we use a layout
component like here

```typescript jsx
const {MainScreenLayout} = useMainScreenLayout()
const {SearchBar} = useSearchBar()
return <MainScreenLayout title='Search'><SearchBar/></MainScreenLayout>
```

### Dependency inject the component using 'important components'

Add the component to the important components. We have SearchImportantComponents and will probably others like
AiAssistantImportantComponents

```typescript jsx
export interface SearchImportantComponents<Context, Filters> {
    DataSourceNavBarLayout: DataSourceNavBarLayout
    DataSourceAllButton: DataSourceAllButton
    SearchBar: SearchBar
    displayLogin: DisplayLogin
    NotLoggedIn?: () => React.ReactElement
    LoadingDisplay?: LoadingDisplay
    //      ...
}
```

We have a `SearchImportantComponentsProvider` that takes the important components and provides them to the rest of the
app using their individual hooks

```typescript jsx
export function SearchImportantComponentsProvider<Context, Filters>({
                                                                        components,
                                                                        children
                                                                    }: SearchImportantComponentsProviderProps<Context, Filters>) {
    const {
        SearchBar, LoadingDisplay, displayLogin, NotLoggedIn, DataSourceNavBarLayout, DataSourceAllButton
    } = components
    const navBarComp: DataSourceNavBarComponents = useMemo(() => ({
        DataSourceAllButton,
        DataSourceNavBarLayout
    }), [DataSourceAllButton, DataSourceNavBarLayoutProvider])
    return <SearchBarProvider SearchBar={SearchBar}>
        <LoginProvider displayLogin={displayLogin} NotLoggedIn={NotLoggedIn}>
            <DataSourceNavBarLayoutProvider components={navBarComp}>
                ...
                {children}
                ...
            </DataSourceNavBarLayoutProvider>
        </LoginProvider>
    </SearchBarProvider>
}
```

# Why Important Components

This is a whole layer. An extra place to wire in every component. We need to understand why we have this.

## benefits

* We can see at a glance every component we need to implement for a feature
    * This is quite a big thing in terms of understanding, especially for new developers
* We do all the dependency injection in one place. This makes the main code simpler and much more readable
* If we have more than one app (mobile app, app for multiple customers) this makes those much simpler
* Perhaps the most important is when we ask `how is this component implemented` we can open up this file and find it
  quickly
* We can use machine tools to walk over these components and do things to them. Like add in profiling, or metrics...
* We can easily do A/B testing and old/new under feature flags even when many components are impacted

## costs

* We need to add the new component to the interface

## Neutral

* We need to dependency inject this somewhere: this is a cost, but it's a cost we have to pay it somewhere

# Error handling

We have four basic kinds of errors

* Errors that are software errors: we missed a case in a switch statement, we have a null pointer exception, we have a
  type error.
    * Typescript helps us enormously here especially with the advanced types. However, they still happen and we need to
      catch them. Sometimes this code is effectively impossible to test as it catches errors that can't happen at the
      moment
* Errors that are due to an outside thing (user/api/etc) doing something wrong: they have entered a string where a
  number is expected, they have entered a date in the wrong format. The api returned data
    * These are often called 'validation'.
    * We often will have more than one in some data and want to see all the errors at once.
    * We want to give the user feedback on what they did wrong, not just the first point
* Errors that are network errors etc
    * These will happen all the time, and we need to handle them gracefully
    * We also want to be able to test these
* OMG errors such as out of memory.
    * We can't really do anything about these, but we want to catch them and give the user a nice message

## Zero errors in the log

We should have zero errors in the log in normal usage no matter what the environment is doing. However, we can have
debugging levels and when they are on, we can display things like validation results.

Actually in normal usage, we should have zero anything in the log. As a dev we can use the devmode to enable logging at the right level

## User doing something wrong / validation

We use this type:

```typescript jsx   
export type Value<T> = { value: T }
export type Errors = { errors: string[] }
export type ErrorsOr<T> = Errors | Value<T>
```

There are helpful 'map' functions that help us to work with these.

## Other errors

When in react we have

```typescript jsx
import {useThrowError} from "@enterprise_search/react_error";

const throwError = useThrowError()
if (somethingBad) return reportError('theType', 'Something bad happened')
```
The default implementation simply throws the message. However, we can change this to send it to a server, or display it

Note this is saying 'never write new Error()' in the code. We should always use this function

# Asynchronicity and LoadingOr / useKleisli

It is extremely challenging to test react code with an asynchronous component. I would go as far as to say 'effectively
impossible'.
It is certainly difficult to make them robust.

To resolve this we have two things to understand

* The Kleisli type
* The LoadingOr type

## Kleisli

```typescript jsx
export type Kleisli<Input, Output> = (input: Input) => Promise<Output>;
```

Note it has one input and one output. There is no loss of generality here: just put everything together in a well named
object
Almost always these are `domain request => Promise<domain result` so it's usually good if they have strong names and are
just one object

## LoadingOr

```typescript jsx

export type LoadingDisplay = () => React.ReactElement;
export type LoadingOrProps<Input, Output> = {
    input: Input;
    kleisli: Kleisli<Input, Output>;
    loading?: LoadingDisplay;
    error?: LoadingOrErrorFn;
    onUnmount?: (output: Output) => void;
    children: (output: Output) => React.ReactNode;
}
export type LoadingOrErrorProps = { error: string; }
export type LoadingOrErrorFn = (props: LoadingOrErrorProps) => React.ReactNode;
``` 

### Usage

Here is an example usage: Note how we can split the code up into two parts: the fetching and the displaying. This
example
is particularly complex because the image needs to be disposed of when the component is unmounted. Usually you won't
want that

```typescript jsx
export function LoadAndDisplayProfileImage(props: ProfileImageProps) {
    const {altText = "Profile image"} = props;
    const fetchProfileImage = useFetchProfileImage();
    return <LoadingOr input={props} kleisli={fetchProfileImage} onUnmount={disposeOnUnmount} error={ProfileImageError}>
        {({imageUrl}) => <ProfileImage imageUrl={imageUrl} altText={altText}/>}
    </LoadingOr>;
}

export type ProfileImageProps = { imageUrl: string, altText: string }

export function ProfileImage({imageUrl, altText}: ProfileImageProps) {
    return <img src={url} alt={altText}/>
}
```

Note that we have three things that might be displayed 'what do we do when loading', 'what do we do when there is an
error', and 'what do we do when we have the data'.
This is a very common pattern in code involving networks

### Testing

The real power of this is in testing. We can test the fetching and the displaying separately.

#### Testing the fetching

We typically have three tests. For each test we pass to the 'fetching and displaying' component a mock function with a
promise. The three states are

* The promise is pending, and we test that we display the loading
* The promise holds data, and we test that we display the data
* The promise is rejected, and we test that we display the error

Sometimes I'll have a fourth: checking the dismounting. This is for when we are using resources that need to be disposed
of.

Note that there is no time sensitivity here. No waiting for useEffects to finish. No waiting for the network. We test
these statically
and very simply

#### Testing the displaying

Same is normal. Just pass in the data and see what is displayed.

# The Filters generic is a composed type, and we don't know what it is until the main method

This was a very challenging part of the 'type programming'.

* We want to be open to extension but closed to modification (this is perhaps our main goal)
* We know that we have common filters that many data sources support. We
* We know that in the future we will be adding more filters, and we can't predict what they will look like.
* We know we need to have state for these, and display these
* We would like strong type safety so that our code gives us a compilation error.

So the solution is to have the Filters generic that holds the state of all the filters. Internally we know
it is a record from the name of the filter to it's state. In most places we just care it's a 'generic filters'.

There are three parts of the solution

## Defining a new filter

```typescript jsx
export const timefilterPluginName = 'time';
export type TimeFilters = {
    [timefilterPluginName]: string
}
```

This is fairly straightforward. We have a name for the filter and the state of the filter. The name needs to be unique

## Combining these in the main index.ts

```typescript jsx
export type SearchAppFilters = TimeFilters & KeywordsFilter // & 
//...
```

This is simple. It just combines all the filters. We can add more filters as we go along. Only the main method needs to
know about
this. It provides type safety to all the methods

## Using the filters

Let's suppose we are coding up a search function that knows about time and keywords. We can use the filters like this.

```typescript jsx
import {ErrorsOr} from "@enterprise_search/errors";

export function search<Filters extends TimeFilters & KeywordsFilter>(filters: Filters): Promise<ErrorsOr<SearchResult>> {
    // and here we have access to the data in the filters
}
```

If we have a lot of these, and we want to make it less verbose we can use a type alias. Usually named for the area of
the code we are in. This is a good practice because if we want to add one, or remove one, it's all done in one place

```typescript jsx
type FiltersForElasticSearch = TimeFilters & KeywordsFilter

export function search<Filters extends FiltersForElasticSearch>(filters: Filters): Promise<ErrorsOr<SearchResult>> {
    // and here we have access to the data in the filters
}
```

