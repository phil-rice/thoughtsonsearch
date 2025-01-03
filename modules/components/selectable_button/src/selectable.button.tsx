import {makeContextFor, makeContextForState} from "@enterprise_search/react_utils";

export type SelectableButtonProps = {
    text: string
    selected: boolean
    onClick: () => void
}
export type SelectableButton = (props: SelectableButtonProps) => React.ReactNode

export const {use: useSelectableButton, Provider: SelectableButtonProvider} = makeContextFor<SelectableButton, 'selectableButton'>('selectableButton')
