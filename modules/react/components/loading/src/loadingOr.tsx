import React, {useEffect} from "react";
import {hasData, hasError, isLoading, Kleisli, useKleisli} from "./use.kleisli";

export type LoadingOrErrorProps = {
    error: string;
}
export type LoadingOrErrorFn = (props: LoadingOrErrorProps) => React.ReactNode;

export type LoadingDisplay = () => React.ReactElement;
export type LoadingOrProps<Input, Output> = {
    input: Input;
    kleisli: Kleisli<Input, Output>;
    loading?: LoadingDisplay;
    error?: LoadingOrErrorFn;
    onUnmount?: (output: Output) => void;
    children: (output: Output) => React.ReactElement;
}

export function defaultLoading(): React.ReactElement {
    return <div>Loading...</div>;
}


export const defaultError: LoadingOrErrorFn = ({error}): React.ReactElement =>
    <div>Error: {error}</div>;

export function LoadingOr<Input, Output>({input, kleisli, loading = defaultLoading, error = defaultError, children, onUnmount = () => {}}: LoadingOrProps<Input, Output>): React.ReactNode {
    const state = useKleisli<Input, Output>(kleisli, input);
    useEffect(() => {
        return () => {if (hasData(state)) onUnmount(state.data as Output);};
    }, [state.data, onUnmount]);
    if (isLoading(state)) return loading!();
    if (hasError(state)) return error({error: state.error as string}) || null;
    if (hasData(state)) return children!(state.data as Output);
    console.error("This should never happen: state is in an invalid state", state);
    return <></>;
}