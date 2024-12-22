export type SovereignProps = {}
export type Sovereign = (props: SovereignProps) => React.ReactElement

/** Sovereign state is a generic that is a record from the soverign name to the state of that sovereign
 * A big design decision here is about are sovereigns reentrant?. If they are (which is a natural thing in many
 * scenarios), then the state of the sovereign should be a stack of states. But then how does that relate to the
 * url?
 * */
export type SovereignSelectionState<SovereignState> = {
    /* The name of the sovereign selected */
    selected: string
    state: SovereignState
}