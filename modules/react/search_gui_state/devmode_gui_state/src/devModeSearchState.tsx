import {useSearchState} from "@enterprise_search/react_search_state";
import React from "react";
import {SearchType, searchTypes} from "@enterprise_search/search_state";

export function DevModeSearchState<Filters, >() {
    const [selected, setSelected] = React.useState<SearchType | null>(null)
    const [searchState] = useSearchState<Filters>()

    function Body() {
        if (!selected) return <pre>{JSON.stringify(searchState, null, 2)}</pre>
        return <pre>{JSON.stringify(searchState.searches[selected], null, 2)}</pre>

    }

    type SelectButtonProps = { name: string, st: SearchType | null }

    function SelectButton({name, st}: SelectButtonProps) {
        return <button onClick={() => setSelected(st)}>{name}</button>
    }

    function SelectNavBar() {
        return <nav>
            <SelectButton name='all' st={null}/>
            {searchTypes.map(st => <SelectButton key={st} name={st} st={st}/>)}
        </nav>
    }

    return <div className='dev-mode-search-state'>
        <SelectNavBar/>
        <Body/>
    </div>
}
