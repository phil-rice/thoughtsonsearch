import {Dispatch, SetStateAction} from "react";


export type Setter<T> = Dispatch<SetStateAction<T>>
export type GetterSetter<T> = [T, Setter<T>]
